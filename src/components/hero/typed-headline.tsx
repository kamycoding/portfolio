'use client'

import { useEffect, useState } from 'react'

import { useReady } from '@/hooks/use-ready'
import { prefersReducedMotion } from '@/lib/actions'
import { cn } from '@/lib/utils'

import styles from './hero.module.css'

type TypedHeadlineProps = Readonly<{
  line1: string
  line2: string
  className?: string
}>

// Typed once per page load; after a language switch the headline appears instantly, like the prototype.
let typedBefore = false

const TypedHeadline = ({ line1, line2, className }: TypedHeadlineProps) => {
  const ready = useReady()

  // null renders the full text (server HTML, reduced motion, later visits).
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    if (!ready || typedBefore || prefersReducedMotion()) return

    typedBefore = true

    const total = line1.length + line2.length
    let index = 0
    let timer = 0

    // Prototype timing: 26 to 60ms per character, a 260ms pause at the line break.
    const step = () => {
      setCount(index)

      if (index++ >= total) return

      timer = window.setTimeout(step, index === line1.length + 1 ? 260 : 26 + Math.random() * 34)
    }

    timer = window.setTimeout(step, 0)

    return () => window.clearTimeout(timer)
  }, [ready, line1, line2])

  const typed = count ?? line1.length + line2.length
  const first = line1.slice(0, Math.min(typed, line1.length))
  const second = typed > line1.length ? line2.slice(0, typed - line1.length) : ''

  return (
    <h1 className={cn(styles.h1, className)}>
      <span className='sr-only'>{`${line1} ${line2}`}</span>
      <span aria-hidden='true'>
        {first}
        {typed >= line1.length && <br />}
        <span className={styles.soft}>{second}</span>
        <span className={styles.caret} />
      </span>
    </h1>
  )
}

export default TypedHeadline
