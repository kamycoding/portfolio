'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { useTranslations } from 'next-intl'

import styles from './interactive.module.css'

// The same amount of work, done in one block or in small chunks.
const WORK_MS = 1500
const CHUNK_MS = 5

type Mode = 'block' | 'chunks'

type YieldMethod = 'scheduler' | 'timeout'

type Result = Readonly<{ mode: Mode; gap: number; frames: number; method?: YieldMethod }>

// Holds the main thread, on purpose: this is the whole point of the demo.
const busy = (ms: number) => {
  const end = performance.now() + ms

  while (performance.now() < end) {
    // Spin until the time is up.
  }
}

type SchedulerLike = Readonly<{ yield?: () => Promise<void> }>

const scheduler = () => (globalThis as { scheduler?: SchedulerLike }).scheduler

const hasSchedulerYield = () => typeof scheduler()?.yield === 'function'

// scheduler.yield() where the browser has it, otherwise a timer with no delay. Both end the current task.
const pause = (method: YieldMethod) =>
  method === 'scheduler' ? scheduler()!.yield!() : new Promise<void>(resolve => setTimeout(resolve, 0))

const MainThreadDemo = () => {
  const t = useTranslations('journal.interactive.thread')
  const counter = useRef<HTMLElement>(null)
  const frames = useRef(0)
  const longestGap = useRef(0)
  const startFrames = useRef(0)

  // Set when the work is done; the next animation frame turns it into a result, so the gap includes the freeze.
  const pending = useRef<Readonly<{ mode: Mode; method?: YieldMethod }> | null>(null)
  const [running, setRunning] = useState<Mode | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  // Known only in the browser, so the server HTML leaves the line empty.
  const method = useSyncExternalStore(
    () => () => {},
    () => (hasSchedulerYield() ? 'scheduler' : 'timeout'),
    () => null
  )

  // The counter counts animation frames. It is written straight to the DOM, so counting never re-renders.
  useEffect(() => {
    let frame = 0
    let last = 0

    // The timestamp passed to the callback can predate a long task, so the gap is measured with the clock itself.
    const tick = () => {
      const now = performance.now()

      frames.current += 1

      if (counter.current) counter.current.textContent = String(frames.current)

      if (last) longestGap.current = Math.max(longestGap.current, now - last)

      last = now

      if (pending.current) {
        const done = pending.current

        pending.current = null
        setResult({
          mode: done.mode,
          method: done.method,
          gap: Math.round(longestGap.current),
          frames: frames.current - startFrames.current
        })
        setRunning(null)
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [])

  const start = (mode: Mode) => {
    if (running) return

    longestGap.current = 0
    startFrames.current = frames.current
    setResult(null)
    setRunning(mode)

    // Long enough for the button to show its state before the thread is held.
    window.setTimeout(async () => {
      if (mode === 'block') {
        busy(WORK_MS)
        pending.current = { mode }

        return
      }

      const chosen: YieldMethod = hasSchedulerYield() ? 'scheduler' : 'timeout'

      for (let done = 0; done < WORK_MS; done += CHUNK_MS) {
        busy(CHUNK_MS)
        await pause(chosen)
      }

      pending.current = { mode, method: chosen }
    }, 80)
  }

  return (
    <div className={styles.thread}>
      <p className={styles.counter}>
        {t('frames')}: <b ref={counter}>0</b>
      </p>

      <div className={styles.actions}>
        <button
          type='button'
          className={styles.button}
          aria-disabled={running !== null || undefined}
          onClick={() => start('block')}
        >
          {t('block')}
        </button>
        <button
          type='button'
          className={styles.button}
          aria-disabled={running !== null || undefined}
          onClick={() => start('chunks')}
        >
          {t('chunks')}
        </button>
      </div>

      <p className={styles.hint}>{method && t(method === 'scheduler' ? 'yieldScheduler' : 'yieldTimeout')}</p>

      <div role='status' className={styles.result}>
        {running && <p>{t('working')}</p>}
        {!running && result && (
          <p>
            {t(result.mode === 'block' ? 'resultBlock' : 'resultChunks', { gap: result.gap, frames: result.frames })}
          </p>
        )}
      </div>
    </div>
  )
}

export default MainThreadDemo
