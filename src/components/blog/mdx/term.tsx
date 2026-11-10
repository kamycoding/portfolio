'use client'

import { type MouseEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import { createHoverIntent } from '@/lib/blog/hover-intent'
import { placePopover } from '@/lib/blog/popover-position'

import AudioButton, { type ClipAudio } from './audio-button'
import styles from './learning.module.css'

type TermProps = Readonly<{ de: string; en: string; note?: string; audio: ClipAudio; children: ReactNode }>

/*
 * A nonmodal disclosure on the native Popover API: Escape, light dismiss and focus return come from the browser,
 * and it opens even before hydration. Script places it next to the word and, for a mouse, opens it on hover.
 * popover="auto" keeps one open at a time.
 */
const Term = ({ de, en, note, audio, children }: TermProps) => {
  const t = useTranslations('journal.audio')
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)
  const intent = useRef<ReturnType<typeof createHoverIntent>>(null)

  useEffect(() => {
    const element = panel.current!
    const button = trigger.current!
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let frame = 0

    const hover = createHoverIntent({
      open: () => element.showPopover(),
      close: () => element.hidePopover(),
      isOpen: () => element.matches(':popover-open')
    })

    intent.current = hover

    // Mouse only: touch and pen keep tap to open, and a coarse pointer never gets a hover timer.
    const onEnter = (onTrigger: boolean) => (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && finePointer.matches) hover.enter(onTrigger)
    }

    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hover.leave()
    }

    const enterTrigger = onEnter(true)
    const enterPanel = onEnter(false)

    // Focus inside, for example on the audio button, keeps the panel open after the pointer leaves.
    const pin = () => hover.pin()

    const place = () => {
      const { top, left } = placePopover(trigger.current!.getBoundingClientRect(), element.getBoundingClientRect(), {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      })

      element.style.top = `${top}px`
      element.style.left = `${left}px`
      element.dataset.placed = 'true'
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(place)
    }

    const listen = (on: boolean) => {
      const method = on ? 'addEventListener' : 'removeEventListener'

      window[method]('scroll', schedule, { capture: true, passive: true })
      window[method]('resize', schedule)
    }

    // Hidden until measured, so the panel never flashes at the browser's centred default.
    const beforeToggle = (event: Event) => {
      if ((event as ToggleEvent).newState === 'open') element.dataset.placed = 'pending'
    }

    const toggle = (event: Event) => {
      const isOpen = (event as ToggleEvent).newState === 'open'

      setOpen(isOpen)
      listen(isOpen)
      if (isOpen) place()
      else hover.closed()
    }

    element.addEventListener('beforetoggle', beforeToggle)
    element.addEventListener('toggle', toggle)
    element.addEventListener('focusin', pin)
    element.addEventListener('pointerenter', enterPanel)
    element.addEventListener('pointerleave', onLeave)
    button.addEventListener('pointerenter', enterTrigger)
    button.addEventListener('pointerleave', onLeave)

    return () => {
      element.removeEventListener('beforetoggle', beforeToggle)
      element.removeEventListener('toggle', toggle)
      element.removeEventListener('focusin', pin)
      element.removeEventListener('pointerenter', enterPanel)
      element.removeEventListener('pointerleave', onLeave)
      button.removeEventListener('pointerenter', enterTrigger)
      button.removeEventListener('pointerleave', onLeave)
      hover.dispose()
      intent.current = null
      listen(false)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Click, tap, Enter and Space still toggle; on a panel that hover opened, they pin it instead of closing it.
  const pinOnClick = (event: MouseEvent) => {
    if (intent.current?.pin()) event.preventDefault()
  }

  return (
    <>
      <button
        ref={trigger}
        type='button'
        lang='de'
        className={styles.term}
        popoverTarget={id}
        aria-controls={id}
        aria-expanded={open}
        onClick={pinOnClick}
      >
        {children}
      </button>
      {/* A span, so the panel stays valid inside the paragraph and is read right after the word. */}
      <span ref={panel} id={id} popover='auto' className={styles.panel}>
        <span className={styles.panelHead}>
          <span lang='de' className={styles.panelTerm}>
            {de}
          </span>
          <AudioButton {...audio} label={t('term')} />
        </span>
        <span lang='en'>{en}</span>
        {note && <span className={styles.note}>{note}</span>}
      </span>
    </>
  )
}

export default Term
