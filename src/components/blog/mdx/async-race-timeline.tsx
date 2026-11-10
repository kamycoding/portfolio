'use client'

import { useId, useState } from 'react'

import { useTranslations } from 'next-intl'

import styles from './interactive.module.css'

// Three fake saves with these durations, started three ways. The timers are real and the numbers are measured.
const SAVES = [400, 700, 300] as const

const SCALE = 1600
const TICKS = [0, 400, 800, 1200, 1600] as const

type ModeId = 'forEach' | 'forOf' | 'all'

type Save = Readonly<{ start: number; end?: number }>

type Run = Readonly<{ saves: readonly (Save | undefined)[]; off?: number }>

const MODES: readonly { id: ModeId; code: string }[] = [
  { id: 'forEach', code: 'items.forEach(async item => { await save(item) })' },
  { id: 'forOf', code: 'for (const item of items) { await save(item) }' },
  { id: 'all', code: 'await Promise.all(items.map(save))' }
]

const EMPTY: Readonly<Record<ModeId, Run>> = {
  forEach: { saves: [] },
  forOf: { saves: [] },
  all: { saves: [] }
}

// A copy of the saves with one entry replaced.
const withSave = (saves: readonly (Save | undefined)[], index: number, save: Save) => {
  const next = [...saves]

  next[index] = save

  return next
}

const pct = (ms: number) => `${Math.min(100, (ms / SCALE) * 100)}%`

// Done when every save has ended: the latest end.
const finished = (run: Run) =>
  run.saves.length === SAVES.length && run.saves.every(save => save?.end !== undefined)
    ? Math.max(...run.saves.map(save => save!.end!))
    : undefined

const AsyncRaceTimeline = () => {
  const t = useTranslations('journal.interactive.timeline')
  const id = useId()
  const [runs, setRuns] = useState(EMPTY)
  const [running, setRunning] = useState(false)
  const [ran, setRan] = useState(false)

  const run = async () => {
    if (running) return

    setRuns(EMPTY)
    setRan(true)
    setRunning(true)

    const origin = performance.now()
    const now = () => Math.round(performance.now() - origin)

    const update = (mode: ModeId, change: (current: Run) => Run) =>
      setRuns(current => ({ ...current, [mode]: change(current[mode]) }))

    // One fake save: it records when it started and when it ended.
    const save = async (mode: ModeId, index: number) => {
      update(mode, current => ({ ...current, saves: withSave(current.saves, index, { start: now() }) }))
      await new Promise(resolve => setTimeout(resolve, SAVES[index]))
      update(mode, current => ({
        ...current,
        saves: withSave(current.saves, index, { ...current.saves[index]!, end: now() })
      }))
    }

    const off = (mode: ModeId) => update(mode, current => ({ ...current, off: now() }))

    // The bug: forEach ignores the promises of its async callback, so the spinner goes off straight away.
    SAVES.forEach(async (_, index) => {
      await save('forEach', index)
    })
    off('forEach')

    const sequential = async () => {
      for (let index = 0; index < SAVES.length; index++) await save('forOf', index)

      off('forOf')
    }

    const parallel = async () => {
      await Promise.all(SAVES.map((_, index) => save('all', index)))
      off('all')
    }

    await Promise.all([sequential(), parallel()])
    setRunning(false)
  }

  const summary =
    ran && !running ? MODES.map(mode => ({ mode, off: runs[mode.id].off, done: finished(runs[mode.id]) })) : []

  return (
    <div className={styles.timeline}>
      <div className={styles.actions}>
        <button type='button' className={styles.button} aria-disabled={running || undefined} onClick={run}>
          {running ? t('running') : t('run')}
        </button>
        <span className={styles.hint}>{t('saves', { first: SAVES[0], second: SAVES[1], third: SAVES[2] })}</span>
      </div>

      {MODES.map(mode => {
        const current = runs[mode.id]
        const done = finished(current)

        return (
          <section key={mode.id} aria-labelledby={`${id}-${mode.id}`} className={styles.mode}>
            <div className={styles.modeHead}>
              <h4 id={`${id}-${mode.id}`} className={styles.modeCode}>
                <code>{mode.code}</code>
              </h4>
              <p className={styles.modeStats}>
                {t('spinner')}: <b>{current.off === undefined ? '–' : `${current.off} ms`}</b> · {t('done')}:{' '}
                <b>{done === undefined ? '–' : `${done} ms`}</b>
              </p>
            </div>
            <div className={styles.track} aria-hidden='true'>
              {SAVES.map((_, index) => {
                const save = current.saves[index]

                return (
                  <div key={index} className={styles.lane}>
                    {save?.end !== undefined && (
                      <span
                        className={styles.bar}
                        style={{ left: pct(save.start), width: `calc(${pct(save.end)} - ${pct(save.start)})` }}
                      >
                        {t('save', { number: index + 1 })}
                      </span>
                    )}
                  </div>
                )
              })}
              {current.off !== undefined && <span className={styles.marker} style={{ left: pct(current.off) }} />}
            </div>
          </section>
        )
      })}

      <div className={styles.axis} aria-hidden='true'>
        {TICKS.map(tick => (
          <span key={tick} style={{ left: pct(tick) }}>
            {tick}
          </span>
        ))}
      </div>
      <p className={styles.legend} aria-hidden='true'>
        <span className={styles.legendMark} /> {t('legend')}
      </p>

      <div role='status' className={styles.result}>
        {summary.length > 0 &&
          summary.map(({ mode, off, done }) => (
            <p key={mode.id}>
              <code>{mode.id}</code>: {t('summary', { off: off ?? 0, done: done ?? 0 })}
            </p>
          ))}
      </div>
    </div>
  )
}

export default AsyncRaceTimeline
