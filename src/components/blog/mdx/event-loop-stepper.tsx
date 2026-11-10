'use client'

import { type KeyboardEvent, useId, useState } from 'react'

import { useLocale, useTranslations } from 'next-intl'

import CodeView from './code-view'
import { type Frame, SCENARIOS, type ScenarioId } from './event-loop-scenarios'
import styles from './interactive.module.css'

type PanelProps = Readonly<{
  title: string
  items: readonly string[]
  rows: number
  empty: string

  // The call stack lists its top first, and marks the function that is running.
  stack?: boolean
  prompt?: boolean
}>

const ROW = 32

// Rows are reserved for the fullest frame of the scenario, so stepping never changes the height.
const Panel = ({ title, items, rows, empty, stack, prompt }: PanelProps) => {
  const id = useId()
  const shown = stack ? [...items].reverse() : items

  return (
    <section aria-labelledby={id} className={styles.panel}>
      <h4 id={id} className={styles.panelTitle}>
        {title}
      </h4>
      <ul className={styles.panelBody} style={{ minHeight: rows * ROW + 12 }}>
        {shown.length === 0 && <li className={styles.emptyItem}>{empty}</li>}
        {shown.map((item, index) => (
          <li key={`${item}-${index}`} className={styles.chip} data-top={(stack && index === 0) || undefined}>
            {prompt && <span aria-hidden='true'>› </span>}
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

const most = (frames: readonly Frame[], pick: (frame: Frame) => readonly string[]) =>
  Math.max(1, ...frames.map(frame => pick(frame).length))

// Steps through a precomputed run of the event loop. Nothing is executed: the frames are authored data.
const EventLoopStepper = ({ scenario }: Readonly<{ scenario: ScenarioId }>) => {
  const t = useTranslations('journal.interactive.stepper')
  const locale = useLocale() === 'de' ? 'de' : 'en'
  const { code, frames } = SCENARIOS[scenario]
  const [step, setStep] = useState(0)
  const frame = frames[step]
  const last = frames.length - 1

  const go = (target: number) => setStep(Math.min(last, Math.max(0, target)))

  // Left and Right step, unless the arrow keys are scrolling the focused code.
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof Element && event.target.closest('pre')) return

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(step + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(step - 1)
    }
  }

  return (
    <div role='group' aria-label={t('label')} className={styles.stepper} onKeyDown={onKeyDown}>
      <div className={styles.stepperGrid}>
        <CodeView code={code} label={t('code')} current={frame.line} />
        <div className={styles.queues}>
          <Panel
            title={t('stack')}
            items={frame.stack}
            rows={most(frames, item => item.stack)}
            empty={t('empty')}
            stack
          />
          <Panel title={t('micro')} items={frame.micro} rows={most(frames, item => item.micro)} empty={t('empty')} />
          <Panel title={t('tasks')} items={frame.tasks} rows={most(frames, item => item.tasks)} empty={t('empty')} />
          <Panel
            title={t('console')}
            items={frame.log}
            rows={most(frames, item => item.log)}
            empty={t('empty')}
            prompt
          />
        </div>
      </div>

      <p role='status' className={styles.note}>
        {frame.note[locale]}
      </p>

      <div className={styles.actions}>
        <button
          type='button'
          className={styles.button}
          aria-disabled={step === 0 || undefined}
          onClick={() => go(step - 1)}
        >
          {t('previous')}
        </button>
        <button
          type='button'
          className={styles.button}
          aria-disabled={step === last || undefined}
          onClick={() => go(step + 1)}
        >
          {t('next')}
        </button>
        <button type='button' className={styles.button} aria-disabled={step === 0 || undefined} onClick={() => go(0)}>
          {t('reset')}
        </button>
        <span className={styles.hint}>
          {t('step', { number: step + 1, total: frames.length })} · {t('keys')}
        </span>
      </div>
    </div>
  )
}

export default EventLoopStepper
