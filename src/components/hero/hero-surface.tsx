'use client'

import { type PointerEvent, type ReactNode, useEffect, useRef } from 'react'

import { getBlueprint, subscribeBlueprint } from '@/hooks/use-blueprint'
import { prefersReducedMotion } from '@/lib/actions'
import { cn } from '@/lib/utils'

import styles from './hero.module.css'

type HeroSurfaceProps = Readonly<{
  children: ReactNode
}>

// The dot grid lights up under the pointer and the editor leans toward it (max 5deg), as in the prototype.
// The tilt pauses while the plan/build slider is dragged, so the handle stays under the pointer.
const HeroSurface = ({ children }: HeroSurfaceProps) => {
  const sectionRef = useRef<HTMLElement>(null)
  const frame = useRef(0)
  const last = useRef({ x: 0, y: 0 })

  const update = () => {
    frame.current = 0

    const section = sectionRef.current
    const editor = section?.querySelector<HTMLElement>('[data-hero-editor]')

    if (!section) return

    const box = section.getBoundingClientRect()

    section.style.setProperty('--mx', `${last.current.x - box.left}px`)
    section.style.setProperty('--my', `${last.current.y - box.top}px`)

    if (!editor || window.innerWidth <= 980 || getBlueprint().dragging) return

    const editorBox = editor.getBoundingClientRect()
    const dx = (last.current.x - (editorBox.left + editorBox.width / 2)) / window.innerWidth
    const dy = (last.current.y - (editorBox.top + editorBox.height / 2)) / window.innerHeight

    editor.style.setProperty('--ry', `${(dx * 5).toFixed(2)}deg`)
    editor.style.setProperty('--rx', `${(-dy * 4).toFixed(2)}deg`)
  }

  // Straightens the editor as soon as a drag starts.
  useEffect(
    () =>
      subscribeBlueprint(() => {
        if (!getBlueprint().dragging) return

        const editor = sectionRef.current?.querySelector<HTMLElement>('[data-hero-editor]')

        editor?.style.setProperty('--rx', '0deg')
        editor?.style.setProperty('--ry', '0deg')
      }),
    []
  )

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || prefersReducedMotion()) return

    last.current = { x: event.clientX, y: event.clientY }

    if (frame.current === 0) frame.current = window.requestAnimationFrame(update)
  }

  const onPointerLeave = () => {
    const section = sectionRef.current
    const editor = section?.querySelector<HTMLElement>('[data-hero-editor]')

    section?.style.setProperty('--mx', '-999px')
    editor?.style.setProperty('--rx', '0deg')
    editor?.style.setProperty('--ry', '0deg')
  }

  return (
    <section
      ref={sectionRef}
      id='index'
      data-file='index.tsx'
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(styles.section)}
    >
      {children}
    </section>
  )
}

export default HeroSurface
