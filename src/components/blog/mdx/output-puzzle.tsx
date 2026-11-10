'use client'

import { useEffect, useId, useState } from 'react'

import { useTranslations } from 'next-intl'

import { clearPuzzle, recordPuzzle, usePuzzleScore } from '@/hooks/use-puzzle-score'

import CodeView from './code-view'
import styles from './interactive.module.css'

type OutputPuzzleProps = Readonly<{
  code: string

  // The console lines to choose from, in any order, and the real order they are logged in.
  lines: readonly string[]
  answer: readonly string[]
  explanation: string
}>

// Predict the output: click the console lines in the order you expect, then check. Picks are by position, so each
// line is marked right or wrong where it was put.
const OutputPuzzle = ({ code, lines, answer, explanation }: OutputPuzzleProps) => {
  const t = useTranslations('journal.interactive.puzzle')
  const id = useId()
  const score = usePuzzleScore()
  const [picks, setPicks] = useState<number[]>([])
  const [checked, setChecked] = useState(false)

  // A puzzle that leaves the page no longer counts towards the score.
  useEffect(() => () => clearPuzzle(id), [id])

  const complete = picks.length === lines.length
  const right = picks.map((pick, position) => lines[pick] === answer[position])
  const correct = checked && right.every(Boolean)

  const toggle = (index: number) => {
    if (checked) return

    setPicks(current => (current.includes(index) ? current.filter(pick => pick !== index) : [...current, index]))
  }

  const check = () => {
    if (!complete) return

    setChecked(true)
    recordPuzzle(id, right.every(Boolean))
  }

  const retry = () => {
    setPicks([])
    setChecked(false)
    clearPuzzle(id)
  }

  return (
    <div className={styles.puzzle}>
      <CodeView code={code} label='JavaScript' />

      <p className={styles.instruction} id={`${id}-help`}>
        {t('instruction')}
      </p>

      <div role='group' aria-labelledby={`${id}-help`} className={styles.consoleLines}>
        {lines.map((line, index) => {
          const position = picks.indexOf(index)
          const state = checked && position >= 0 ? (right[position] ? 'right' : 'wrong') : undefined

          return (
            <button
              key={index}
              type='button'
              className={styles.consoleLine}
              aria-pressed={position >= 0}
              aria-disabled={checked || undefined}
              data-state={state}
              onClick={() => toggle(index)}
            >
              <span className={styles.order}>
                {position >= 0 && position + 1}
                {state && (
                  <>
                    <span aria-hidden='true'>{state === 'right' ? ' ✓' : ' ✗'}</span>
                    <span className='sr-only'>{t(state)}</span>
                  </>
                )}
              </span>
              <code>{line}</code>
            </button>
          )
        })}
      </div>

      <div className={styles.actions}>
        {checked ? (
          <button type='button' className={styles.button} onClick={retry}>
            {t('retry')}
          </button>
        ) : (
          <button type='button' className={styles.button} aria-disabled={!complete || undefined} onClick={check}>
            {t('check')}
          </button>
        )}
        <span className={styles.hint}>{!checked && t('picked', { count: picks.length, total: lines.length })}</span>
      </div>

      {/* Rendered empty from the start, so screen readers register the live region before the first check. */}
      <div role='status' className={styles.result}>
        {checked && (
          <>
            <p className={styles.verdict}>
              {correct ? t('correct') : t('incorrect', { right: right.filter(Boolean).length, total: lines.length })}
            </p>
            <p>
              <span className={styles.resultLabel}>{t('realOrder')}</span> <code>{answer.join(', ')}</code>
            </p>
            <p>{explanation}</p>
            <p className={styles.score}>{t('score', { correct: score.correct, attempted: score.attempted })}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default OutputPuzzle
