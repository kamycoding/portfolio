'use client'

import { type FormEvent, useEffect, useId, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import styles from './learning.module.css'

type QuizProps = Readonly<{
  question: string
  choices: ReadonlyArray<Readonly<{ id: string; text: string }>>
  answer: string
  explanation: string
}>

// Native radios in a fieldset; one live region reports the result and the explanation together.
const Quiz = ({ question, choices, answer, explanation }: QuizProps) => {
  const t = useTranslations('journal.quiz')
  const name = useId()
  const first = useRef<HTMLInputElement>(null)
  const refocus = useRef(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [prompted, setPrompted] = useState(false)
  const correct = selected === answer

  // After a retry the choices are enabled again before focus moves back to them.
  useEffect(() => {
    if (checked || !refocus.current) return

    refocus.current = false
    first.current?.focus()
  }, [checked])

  const check = (event: FormEvent) => {
    event.preventDefault()

    if (checked) return

    setPrompted(!selected)
    setChecked(Boolean(selected))
  }

  const stateOf = (id: string) => {
    if (!checked) return undefined
    if (id === answer) return 'answer'

    return id === selected ? 'wrong' : undefined
  }

  const retry = () => {
    refocus.current = true
    setSelected(null)
    setChecked(false)
  }

  return (
    <form className={styles.quiz} onSubmit={check}>
      <fieldset disabled={checked}>
        <legend className={styles.question}>{question}</legend>
        <ul className={styles.choices}>
          {choices.map((choice, index) => {
            const state = stateOf(choice.id)

            return (
              <li key={choice.id}>
                <label className={styles.choice} data-state={state}>
                  <input
                    ref={index === 0 ? first : undefined}
                    type='radio'
                    name={name}
                    value={choice.id}
                    checked={selected === choice.id}
                    onChange={() => {
                      setSelected(choice.id)
                      setPrompted(false)
                    }}
                  />
                  <span>{choice.text}</span>
                  {state && (
                    <span className={styles.mark}>
                      <span aria-hidden='true' className={styles.glyph}>
                        {state === 'answer' ? '✓' : '✗'}
                      </span>
                      {state === 'answer' ? t('correctAnswer') : t('yourAnswer')}
                    </span>
                  )}
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>

      {/* One button that changes its role, so focus stays in place after checking. */}
      <button type={checked ? 'button' : 'submit'} className={styles.button} onClick={checked ? retry : undefined}>
        {checked ? t('retry') : t('check')}
      </button>

      <div role='status' className={styles.result}>
        {prompted && <p>{t('choose')}</p>}
        {checked && (
          <>
            <p className={styles.verdict}>{correct ? t('correct') : t('incorrect')}</p>
            <p>{explanation}</p>
          </>
        )}
      </div>
    </form>
  )
}

export default Quiz
