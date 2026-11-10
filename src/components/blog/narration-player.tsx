'use client'

import { useEffect, useId, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import { endPlayback, startPlayback, stopPlayback } from '@/hooks/use-audio-playback'
import { registerNarrationJump, setNarration } from '@/hooks/use-narration'
import type { NarrationSection } from '@/lib/blog/narration'
import { cn } from '@/lib/utils'

import styles from './narration.module.css'

const RATES = [1, 1.25, 1.5] as const

type Rate = (typeof RATES)[number]

type NarrationPlayerProps = Readonly<{ sections: readonly NarrationSection[]; lang: string }>

/*
 * Reads an article aloud, one clip per h2 section (docs/adr/0007). One native <audio> element with same-origin files:
 * nothing loads before the first Play and nothing autoplays. It shares the page's "one clip at a time" rule with the
 * other audio buttons, and tells the Outline which section is playing.
 */
const NarrationPlayer = ({ sections, lang }: NarrationPlayerProps) => {
  const t = useTranslations('journal.narration')
  const id = useId()
  const audio = useRef<HTMLAudioElement>(null)
  const available = sections.filter(section => section.src)
  const [index, setIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState<Rate>(1)
  const [failed, setFailed] = useState(false)
  const section = available[index]
  const last = available.length - 1

  const pause = () => setPlaying(false)

  const go = (target: number, autoplay: boolean) => {
    setIndex(target)
    setStarted(true)

    if (!autoplay) return

    startPlayback(id, pause)
    setPlaying(true)
  }

  // The Outline highlights the section that is current, and jumps here when an entry is chosen during playback.
  useEffect(() => {
    setNarration({ current: started && section ? section.id : null, playing })
  }, [started, section, playing])

  useEffect(() => {
    registerNarrationJump(target => {
      const position = available.findIndex(item => item.id === target)

      if (position < 0) return false

      go(position, true)

      return true
    })

    return () => registerNarrationJump(null)
  })

  useEffect(
    () => () => {
      stopPlayback(id)
      setNarration({ current: null, playing: false })
    },
    [id]
  )

  // A new file resets the rate to the default one, so both are kept in step.
  useEffect(() => {
    const element = audio.current

    if (!element) return

    element.defaultPlaybackRate = rate
    element.playbackRate = rate
  }, [rate, index])

  useEffect(() => {
    const element = audio.current

    if (!element) return

    if (!playing) {
      element.pause()

      return
    }

    // An interrupted play() rejects with AbortError; only real failures switch the player off.
    element.play().catch((error: DOMException) => {
      if (error.name === 'AbortError') return

      setPlaying(false)
      setFailed(true)
      endPlayback(id)
    })
  }, [playing, index, id])

  if (available.length === 0 || failed) {
    return (
      <section className={cn(styles.player, styles.empty)} aria-label={t('label')}>
        <p className={styles.label}>{t('label')}</p>
        <p className={styles.status}>{t(failed ? 'failed' : 'unavailable')}</p>
      </section>
    )
  }

  const toggle = () => {
    if (playing) {
      pause()
      endPlayback(id)

      return
    }

    startPlayback(id, pause)
    setStarted(true)
    setPlaying(true)
  }

  const step = (direction: -1 | 1) => {
    const target = index + direction

    if (target >= 0 && target <= last) go(target, playing)
  }

  const onEnded = () => {
    if (index < last) {
      setIndex(index + 1)

      return
    }

    pause()
    endPlayback(id)
  }

  return (
    <section className={styles.player} aria-label={t('label')}>
      <div className={styles.head}>
        <p className={styles.label}>{t('label')}</p>
        <div role='group' aria-label={t('speed')} className={styles.rates}>
          {RATES.map(value => (
            <button
              key={value}
              type='button'
              className={styles.button}
              aria-pressed={rate === value}
              onClick={() => setRate(value)}
            >
              {value}x
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type='button'
          className={styles.button}
          aria-disabled={index === 0 || undefined}
          onClick={() => step(-1)}
        >
          <svg aria-hidden='true' viewBox='0 0 16 16' className={styles.icon}>
            <path d='M3 3h1.5v10H3zM14 3v10L6 8z' fill='currentColor' />
          </svg>
          <span className={styles.text}>{t('previous')}</span>
        </button>
        <button type='button' className={cn(styles.button, styles.play)} aria-pressed={playing} onClick={toggle}>
          <svg aria-hidden='true' viewBox='0 0 16 16' className={styles.icon}>
            {playing ? (
              <path d='M4 3h3v10H4zM9 3h3v10H9z' fill='currentColor' />
            ) : (
              <path d='M5 3v10l8-5z' fill='currentColor' />
            )}
          </svg>
          <span>{t(playing ? 'pause' : 'play')}</span>
        </button>
        <button
          type='button'
          className={styles.button}
          aria-disabled={index === last || undefined}
          onClick={() => step(1)}
        >
          <span className={styles.text}>{t('next')}</span>
          <svg aria-hidden='true' viewBox='0 0 16 16' className={styles.icon}>
            <path d='M12.5 3H14v10h-1.5zM2 3v10l8-5z' fill='currentColor' />
          </svg>
        </button>
      </div>

      <p role='status' lang={started ? lang : undefined} className={styles.status}>
        {started
          ? t('status', { number: index + 1, count: available.length, title: section.title })
          : t('ready', { count: available.length })}
      </p>

      <audio ref={audio} src={section.src} preload='none' onEnded={onEnded} onError={() => setFailed(true)} />
    </section>
  )
}

export default NarrationPlayer
