'use client'

import { useEffect, useRef, useState } from 'react'

import { prefersReducedMotion } from '@/lib/actions'

type CountUpProps = Readonly<{
  to: number
}>

// Counts from 0 once 60% visible (900ms, ease-out cubic), as in the prototype.
// The server HTML has the final number, so it is right without JavaScript.
const CountUp = ({ to }: CountUpProps) => {
  const ref = useRef<HTMLElement>(null)
  const [value, setValue] = useState(to)

  useEffect(() => {
    const element = ref.current

    if (!element || prefersReducedMotion()) return

    let frame = 0
    let started = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (started) return

        if (!entry.isIntersecting) {
          setValue(0)

          return
        }

        started = true
        observer.disconnect()

        const start = performance.now()

        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / 900)

          setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))))

          if (progress < 1) frame = window.requestAnimationFrame(tick)
        }

        frame = window.requestAnimationFrame(tick)
      },
      { threshold: 0.6 }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [to])

  return <b ref={ref}>{value}</b>
}

export default CountUp
