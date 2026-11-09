'use client'

import { useEffect, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import { purrCat, useCat, wakeCat } from '@/hooks/use-cat'
import { cn } from '@/lib/utils'

import styles from './cat.module.css'

type CatProps = Readonly<{
  className?: string

  // Both cats share one state, so only the first one announces its bubble to screen readers.
  announce?: boolean
}>

// From the prototype: a hover longer than this purrs instead of waking the cat.
const PURR_DELAY_MS = 650

const Cat = ({ className, announce = true }: CatProps) => {
  const t = useTranslations('cat')
  const { awake, wakes, bubble, bubbleVisible } = useCat()
  const [purring, setPurring] = useState(false)
  const purrTimer = useRef(0)
  const leftPupil = useRef<SVGCircleElement>(null)
  const rightPupil = useRef<SVGCircleElement>(null)

  // While awake, the pupils follow the pointer (max 1.6px), as in the prototype.
  useEffect(() => {
    if (!awake) return

    let frame = 0
    let x = 0
    let y = 0

    const follow = () => {
      frame = 0

      for (const pupil of [leftPupil.current, rightPupil.current]) {
        const svg = pupil?.ownerSVGElement

        if (!pupil || !svg) continue

        const box = svg.getBoundingClientRect()
        const scale = box.width / 140
        const cx = box.left + Number(pupil.getAttribute('cx')) * scale
        const cy = box.top + Number(pupil.getAttribute('cy')) * scale
        const angle = Math.atan2(y - cy, x - cx)
        const distance = Math.min(1.6, Math.hypot(x - cx, y - cy) / 60)

        pupil.style.transform = `translate(${(Math.cos(angle) * distance).toFixed(2)}px,${(Math.sin(angle) * distance).toFixed(2)}px)`
      }
    }

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY

      if (frame === 0) frame = window.requestAnimationFrame(follow)
    }

    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.cancelAnimationFrame(frame)
    }
  }, [awake])

  useEffect(() => () => window.clearTimeout(purrTimer.current), [])

  const onPointerEnter = () => {
    purrTimer.current = window.setTimeout(() => {
      if (purrCat()) setPurring(true)
    }, PURR_DELAY_MS)
  }

  const onPointerLeave = () => {
    window.clearTimeout(purrTimer.current)
    setPurring(false)
  }

  const onWake = () => {
    window.clearTimeout(purrTimer.current)
    setPurring(false)
    wakeCat()
  }

  return (
    <div className={cn(styles.wrap, className)} data-shell-ui=''>
      <button
        type='button'
        data-cursor='pet'
        aria-label={awake ? t('awakeLabel') : t('wake')}
        onClick={onWake}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        className={cn(styles.cat, awake && styles.awake, purring && styles.purr)}
      >
        <svg
          viewBox='0 0 140 110'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.6'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <text className={styles.zz} x='62' y='20'>
            z
          </text>
          <text className={cn(styles.zz, styles.zzSmall)} x='71' y='11'>
            z
          </text>
          <path className={styles.tail} d='M112 66 C123 70 125 84 119 94 C115 101 120 107 127 103' />

          {/* The key restarts the stretch animation on every wake-up. */}
          <g key={wakes} className={cn(styles.bodyG, wakes > 0 && styles.stretch)}>
            <g className={styles.breathe}>
              <path className={styles.fill} d='M34 70 C30 52 44 40 66 38 C90 36 112 44 116 62 L117 70 Z' />
              <path className={styles.stripe} d='M78 41 q4 6 2 12 M90 43 q4 6 1 12 M101 48 q3 5 0 10' />
            </g>
            <path className={styles.ear} d='M21 37 L23 17 L36 28' />
            <path className={cn(styles.ear, styles.earRight)} d='M43 28 L56 17 L57 37' />
            <path
              className={styles.fill}
              d='M18 46 C14 32 26 25 39 25 C53 25 62 32 60 46 C58 58 48 62 39 62 C28 62 20 58 18 46Z'
            />
            <path d='M25.5 22.5 l2.5 5 M53 22.5 l-2.5 5' strokeWidth='1.1' opacity='.6' />
            <g className={styles.shut}>
              <path d='M27 43 q4 3 8 0' />
              <path d='M43 43 q4 3 8 0' />
            </g>
            <g className={styles.open}>
              <g className={styles.lidblink}>
                <ellipse cx='31' cy='42.5' rx='3.6' ry='3.9' strokeWidth='1.3' />
                <ellipse cx='47' cy='42.5' rx='3.6' ry='3.9' strokeWidth='1.3' />
                <circle ref={leftPupil} className={styles.pupil} cx='31' cy='42.5' r='1.9' />
                <circle ref={rightPupil} className={styles.pupil} cx='47' cy='42.5' r='1.9' />
              </g>
            </g>
            <ellipse className={styles.blush} cx='25' cy='51.5' rx='3.2' ry='1.8' />
            <ellipse className={styles.blush} cx='53' cy='51.5' rx='3.2' ry='1.8' />
            <path d='M37.4 49 l1.6 1.7 l1.6 -1.7 Z' fill='currentColor' strokeWidth='1' />
            <path d='M39 50.8 q-1.8 2.8 -4 1.4 M39 50.8 q1.8 2.8 4 1.4' strokeWidth='1.2' />
            <path d='M22 50 l-11 -2.5 M22 53 l-11 1.5 M56 50 l11 -2.5 M56 53 l11 1.5' strokeWidth='1' opacity='.7' />
            <path className={styles.fill} d='M29.5 66 C27.5 75 39 77 39.5 67' />
            <path className={styles.fill} d='M44.5 66 C42.5 75 54 77 54.5 67' />
            <path d='M32 73 v1.6 M35 73.6 v1.6 M47 73 v1.6 M50 73.6 v1.6' strokeWidth='1' opacity='.55' />
          </g>
        </svg>
      </button>

      <div
        aria-live={announce ? 'polite' : undefined}
        aria-hidden={announce ? undefined : true}
        className={cn(styles.meow, bubbleVisible && styles.show)}
      >
        {bubble === 'meow' ? t('meow') : 'prrr'}
      </div>
    </div>
  )
}

export default Cat
