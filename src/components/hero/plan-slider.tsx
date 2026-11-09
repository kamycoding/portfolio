'use client'

import type { KeyboardEvent, PointerEvent, RefObject } from 'react'

import { useTranslations } from 'next-intl'

import { animateBuild, setBuild, setDragging, useBlueprint } from '@/hooks/use-blueprint'
import { BUILD_MAX, keyToBuild, planPercent } from '@/lib/blueprint'

import styles from './hero.module.css'

type PlanSliderProps = Readonly<{
  rootRef: RefObject<HTMLDivElement | null>
}>

// Before/after handle between the build (left) and the plan (right), as a WAI-ARIA slider.
const PlanSlider = ({ rootRef }: PlanSliderProps) => {
  const t = useTranslations('hero.blueprint')
  const { build } = useBlueprint()
  const value = Math.round(build)

  const moveTo = (clientX: number) => {
    const root = rootRef.current

    if (!root) return

    const rect = root.getBoundingClientRect()

    setBuild(((clientX - rect.left) / rect.width) * BUILD_MAX)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return

    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) moveTo(event.clientX)
  }

  const onPointerEnd = () => setDragging(false)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = keyToBuild(event.key, value)

    // Escape at rest stays unhandled, so it can still close things elsewhere.
    if (next === null || (event.key === 'Escape' && value === BUILD_MAX)) return

    event.preventDefault()

    if (event.key === 'Escape') animateBuild(BUILD_MAX)
    else setBuild(next)
  }

  return (
    <div className={styles.handle}>
      <span aria-hidden='true' className={styles.handleLine} />
      <div
        role='slider'
        tabIndex={0}
        aria-label={t('slider')}
        aria-orientation='horizontal'
        aria-valuemin={0}
        aria-valuemax={BUILD_MAX}
        aria-valuenow={value}
        aria-valuetext={t('value', { value: planPercent(value) })}
        data-cursor='drag'
        className={styles.grip}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onLostPointerCapture={onPointerEnd}
        onKeyDown={onKeyDown}
        onDoubleClick={() => animateBuild(BUILD_MAX)}
      >
        <svg viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true'>
          <path d='M6 4 L2 8 L6 12 M10 4 L14 8 L10 12' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </div>
    </div>
  )
}

export default PlanSlider
