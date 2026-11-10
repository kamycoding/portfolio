'use client'

import { type ReactNode, useEffect, useId, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import { placePopover } from '@/lib/blog/popover-position'

import AudioButton, { type ClipAudio } from './audio-button'
import styles from './learning.module.css'

type TermProps = Readonly<{ de: string; en: string; note?: string; audio: ClipAudio; children: ReactNode }>

/*
 * A nonmodal disclosure on the native Popover API: Escape, light dismiss and focus return come from the browser,
 * and it opens even before hydration. Script only places it next to the word.
 */
const Term = ({ de, en, note, audio, children }: TermProps) => {
  const t = useTranslations('journal.audio')
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const element = panel.current!
    let frame = 0

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
    }

    element.addEventListener('beforetoggle', beforeToggle)
    element.addEventListener('toggle', toggle)

    return () => {
      element.removeEventListener('beforetoggle', beforeToggle)
      element.removeEventListener('toggle', toggle)
      listen(false)
      cancelAnimationFrame(frame)
    }
  }, [])

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
