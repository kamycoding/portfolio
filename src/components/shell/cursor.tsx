'use client'

import { useEffect, useRef } from 'react'

import { useTranslations } from 'next-intl'

import { prefersReducedMotion } from '@/lib/actions'

import styles from './cursor.module.css'

// Text fields and code turn the cursor into a caret.
const TEXT = 'input:not([type=checkbox]), textarea, [contenteditable], [data-cursor="text"]'

// Everything a click does something on grows the ring; data-cursor names the action.
const CLICKABLE = 'a, button, [role="button"], [role="option"], [data-cursor]'

type Labels = Readonly<Record<'go' | 'open' | 'copy' | 'run' | 'pet' | 'fold', string>>

const kindOf = (target: Element, labels: Labels): ['text' | 'link' | '', string] => {
  if (target.closest(TEXT)) return ['text', '']

  const clickable = target.closest<HTMLElement>(CLICKABLE)

  if (!clickable) return ['', '']

  const action = clickable.closest<HTMLElement>('[data-cursor]')?.dataset.cursor

  if (action && action in labels) return ['link', labels[action as keyof Labels]]
  if (clickable.matches('a[target="_blank"]')) return ['link', '↗']
  if (clickable.matches('a[href*="#"]')) return ['link', labels.go]

  return ['link', '']
}

// A dot that sits exactly on the pointer and a ring that follows a little behind (prototype app.js).
const Cursor = () => {
  const t = useTranslations('cursor')
  const rootRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  const labels: Labels = {
    go: t('go'),
    open: t('open'),
    copy: t('copy'),
    run: t('run'),
    pet: t('pet'),
    fold: t('fold')
  }

  const labelKey = JSON.stringify(labels)

  useEffect(() => {
    const root = rootRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    const label = labelRef.current
    const currentLabels = JSON.parse(labelKey) as Labels

    if (!root || !ring || !dot || !label || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const html = document.documentElement
    let x = -100
    let y = -100
    let ringX = -100
    let ringY = -100
    let visible = false
    let frame = 0

    html.classList.add('has-cur')

    // The ring eases toward the pointer and the loop stops once it has arrived.
    const follow = () => {
      const ease = prefersReducedMotion() ? 1 : 0.2

      ringX += (x - ringX) * ease
      ringY += (y - ringY) * ease
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px,${ringY.toFixed(1)}px,0)`
      frame = Math.abs(x - ringX) + Math.abs(y - ringY) > 0.1 ? window.requestAnimationFrame(follow) : 0
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return

      x = event.clientX
      y = event.clientY
      dot.style.transform = `translate3d(${x}px,${y}px,0)`

      if (!visible) {
        visible = true
        ringX = x
        ringY = y
        root.classList.remove(styles.hidden)
      }

      const [kind, text] = event.target instanceof Element ? kindOf(event.target, currentLabels) : ['', '']

      root.classList.toggle(styles.link, kind === 'link')
      root.classList.toggle(styles.text, kind === 'text')

      if (kind === 'link') label.textContent = text
      if (frame === 0) frame = window.requestAnimationFrame(follow)
    }

    const onDown = () => root.classList.add(styles.down)
    const onUp = () => root.classList.remove(styles.down)

    const onLeave = () => {
      visible = false
      root.classList.add(styles.hidden)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      html.classList.remove('has-cur')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.cancelAnimationFrame(frame)
    }
  }, [labelKey])

  return (
    <div ref={rootRef} aria-hidden='true' className={`${styles.cur} ${styles.hidden}`}>
      <span ref={ringRef} className={styles.ring}>
        <span ref={labelRef} className={styles.label} />
      </span>
      <span ref={dotRef} className={styles.dot} />
    </div>
  )
}

export default Cursor
