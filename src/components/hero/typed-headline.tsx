'use client'

import { type CSSProperties, useEffect, useState } from 'react'

import { useIntroRun, useReady } from '@/hooks/use-ready'
import { prefersReducedMotion } from '@/lib/actions'

import styles from './hero.module.css'

type TypedHeadlineProps = Readonly<{
  name: string
  role: string
}>

// The role is typed once per intro (also after "Replay intro"); after a language switch it appears instantly.
let typedRun = 0

// Starts once most letters of the name have risen in.
const TYPE_DELAY_MS = 700

const TypedHeadline = ({ name, role }: TypedHeadlineProps) => {
  const ready = useReady()
  const run = useIntroRun()

  // null renders the full text (server HTML, reduced motion, later visits).
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    if (!ready || run <= typedRun || prefersReducedMotion()) return

    typedRun = run

    let index = 0
    let timer = 0

    // Prototype timing: 26 to 60ms per character.
    const step = () => {
      setCount(index)

      if (index++ >= role.length) return

      timer = window.setTimeout(step, 26 + Math.random() * 34)
    }

    // Empty right away, so the full role does not flash before typing starts.
    timer = window.setTimeout(() => {
      setCount(0)
      timer = window.setTimeout(step, TYPE_DELAY_MS)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [ready, run, role])

  let letter = 0

  return (
    <>
      {/* Screen readers get the plain name; the letter spans exist only for the rise-in. */}
      <h1 className={styles.h1}>
        <span className='sr-only'>{name}</span>
        <span aria-hidden='true'>
          {name.split(' ').map((word, wordIndex) => (
            <span key={word}>
              {wordIndex > 0 && ' '}
              <span className={styles.word}>
                {[...word].map((char, charIndex) => (
                  <span key={charIndex} className={styles.letter} style={{ '--i': letter++ } as CSSProperties}>
                    {char}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </span>
      </h1>
      <p className={styles.role}>
        <span className='sr-only'>{role}</span>
        <span aria-hidden='true'>
          {role.slice(0, count ?? role.length)}
          <span className={styles.caret} />
        </span>
      </p>
    </>
  )
}

export default TypedHeadline
