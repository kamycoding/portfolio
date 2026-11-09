'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import { setReady, unsetReady } from '@/hooks/use-ready'
import { prefersReducedMotion } from '@/lib/actions'
import { cn } from '@/lib/utils'

import styles from './boot.module.css'

type Tone = 'dim' | 'b' | 'ok' | 'tri'

type Segment = readonly [text: string, tone?: Tone]

type Step = Readonly<{
  gap: number
  line: readonly Segment[] | 'spin' | 'bar' | 'ready'
  right?: string
}>

// The build log from the prototype (app.js BOOT), as data instead of HTML. Gaps are in milliseconds.
const STEPS: readonly Step[] = [
  { gap: 0, line: [['$', 'dim'], [' '], ['pnpm build', 'b']] },
  { gap: 140, line: [['▲', 'tri'], [' '], ['kamycoding', 'b'], [' '], ['2.0.0', 'dim']] },
  { gap: 90, line: [['  - Environments: .env.production', 'dim']] },
  { gap: 60, line: [] },
  { gap: 90, line: 'spin' },
  { gap: 170, line: [['  '], ['resolve ', 'dim'], ['   kamyar@latest']], right: '38ms' },
  { gap: 170, line: [['  '], ['install ', 'dim'], ['   architecture → software']], right: '2022' },
  { gap: 170, line: [['  '], ['compile ', 'dim'], ['   typescript, react, next.js']], right: '412ms' },
  { gap: 170, line: [['  '], ['compile ', 'dim'], ['   node, nestjs, postgresql']], right: '306ms' },
  { gap: 170, line: [['  '], ['link    ', 'dim'], ['   heldio '], ['(co-founder)', 'dim']], right: '2026' },
  { gap: 120, line: 'bar' },
  { gap: 120, line: [['✓', 'ok'], [' Generating static pages (5/5)']] },
  { gap: 40, line: [] },
  { gap: 80, line: [['Route (app)', 'b']] },
  { gap: 60, line: [['┌', 'dim'], [' ○ /            '], ['index.tsx', 'dim']] },
  { gap: 60, line: [['├', 'dim'], [' ○ /work        '], ['4 projects', 'dim']] },
  { gap: 60, line: [['├', 'dim'], [' ○ /about       '], ['since 2022', 'dim']] },
  { gap: 60, line: [['├', 'dim'], [' ○ /stack       '], ['20 tools', 'dim']] },
  { gap: 60, line: [['└', 'dim'], [' ○ /contact     '], ['open to work', 'dim']] },
  { gap: 40, line: [] },
  { gap: 160, line: 'ready' }
]

const SPINNER = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
const BAR_WIDTH = 28

const TONE_CLASS: Readonly<Record<Tone, string | undefined>> = {
  dim: styles.dim,
  b: undefined,
  ok: styles.ok,
  tri: styles.tri
}

const Segments = ({ segments }: Readonly<{ segments: readonly Segment[] }>) =>
  segments.map(([text, tone], index) =>
    tone === 'b' ? (
      <b key={index}>{text}</b>
    ) : (
      <span key={index} className={tone && TONE_CLASS[tone]}>
        {text}
      </span>
    )
  )

let replay: (() => void) | null = null

// Command palette "Replay intro" (prototype boot(true)).
export const replayIntro = () => replay?.()

// The site builds itself on every load: a pnpm build log, then the page. Any key or "skip intro" ends it.
const Boot = () => {
  const t = useTranslations('boot')
  const [shown, setShown] = useState(0)
  const [spin, setSpin] = useState(0)
  const [compiled, setCompiled] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [readyIn, setReadyIn] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [forced, setForced] = useState(false)
  const timers = useRef<number[]>([])
  const startedAt = useRef(0)

  const stop = () => {
    timers.current.forEach(timer => {
      window.clearTimeout(timer)
      window.clearInterval(timer)
      window.cancelAnimationFrame(timer)
    })
    timers.current = []
  }

  const finish = useCallback(() => {
    stop()
    setDone(true)
    setReady()
  }, [])

  const play = useCallback(() => {
    stop()
    unsetReady()
    setShown(0)
    setCompiled(null)
    setProgress(0)
    setReadyIn(null)
    setDone(false)

    const start = performance.now()

    startedAt.current = start
    const seconds = (offset = 0) => (performance.now() - start) / 1000 + offset
    const later = (callback: () => void, delay: number) => timers.current.push(window.setTimeout(callback, delay))
    let at = 200

    STEPS.forEach((step, index) => {
      at += step.gap

      later(() => {
        setShown(index + 1)

        if (step.line === 'spin') {
          const spinner = window.setInterval(() => setSpin(frame => frame + 1), 70)

          timers.current.push(spinner)
          later(() => {
            window.clearInterval(spinner)
            setCompiled(seconds(0.9).toFixed(1))
          }, 1050)
        } else if (step.line === 'bar') {
          const barStart = performance.now()

          const fill = (now: number) => {
            const value = Math.min(1, (now - barStart) / 420)

            setProgress(value)

            if (value < 1) timers.current.push(window.requestAnimationFrame(fill))
          }

          timers.current.push(window.requestAnimationFrame(fill))
        } else if (step.line === 'ready') {
          setReadyIn(seconds().toFixed(2))
          later(finish, 650)
        }
      }, at)
    })
  }, [finish])

  useEffect(() => {
    replay = () => {
      setForced(true)
      play()
    }

    // Reduced motion skips the intro; the overlay is already hidden by CSS, so there is no flash.
    const start = window.setTimeout(() => (prefersReducedMotion() ? finish() : play()), 0)

    return () => {
      replay = null
      window.clearTimeout(start)
      stop()
    }
  }, [play, finish])

  // Any key except Tab ends the intro, as in the prototype.
  useEffect(() => {
    if (done) return

    // Ends on the next tick, so the same key press does not also trigger a shortcut. The Enter that replays the
    // intro from the palette is still on its way to window when this listener is added, so older keys are ignored.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' && event.timeStamp >= startedAt.current) window.setTimeout(finish, 0)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [done, finish])

  const filled = Math.round(progress * BAR_WIDTH)

  const renderStep = (step: Step) => {
    if (step.line === 'spin') {
      return compiled ? (
        <>
          <span className={styles.ok}>✓</span> Compiled successfully in {compiled}s
        </>
      ) : (
        <>
          <span className={styles.spin}>{SPINNER[spin % SPINNER.length]}</span> Creating an optimized production build
          ...
        </>
      )
    }

    if (step.line === 'bar') {
      return (
        <>
          {'  '}
          <span className={styles.bar}>{'█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled)}</span>
          <span className={cn(styles.dim, styles.r)}>{Math.round(progress * 100)}%</span>
        </>
      )
    }

    if (step.line === 'ready') {
      return (
        <>
          <span className={styles.ok}>✓</span> <b>Ready</b> in {readyIn}s
        </>
      )
    }

    return (
      <>
        {step.line.length === 0 ? ' ' : <Segments segments={step.line} />}
        {step.right && <span className={cn(styles.dim, styles.r)}>{step.right}</span>}
      </>
    )
  }

  return (
    <div className={cn(styles.boot, done && styles.done, forced && styles.forced)}>
      <div className={styles.term} aria-hidden='true'>
        {STEPS.slice(0, shown).map((step, index) => (
          <div key={index} className={styles.l}>
            {renderStep(step)}
          </div>
        ))}
      </div>
      <div className={styles.foot}>
        <span aria-hidden='true'>{t('key')}</span>
        <button type='button' onClick={finish}>
          {t('skip')}
        </button>
      </div>
    </div>
  )
}

export default Boot
