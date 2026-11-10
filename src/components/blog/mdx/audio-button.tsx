'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'

import { useTranslations } from 'next-intl'

import { endPlayback, startPlayback, stopPlayback, usePlayingId } from '@/hooks/use-audio-playback'
import { cn } from '@/lib/utils'

import styles from './audio-button.module.css'

export type ClipAudio = Readonly<{ src?: string; text: string }>

type AudioButtonProps = ClipAudio &
  Readonly<{
    label: string
    onTime?: (milliseconds: number | null) => void
    className?: string

    // A visible text next to the icon, which then is also the accessible name (WCAG 2.5.3).
    visible?: Readonly<{ idle: string; playing: string }>
  }>

// Only a voice on this device may speak a missing clip; a remote voice would send the text to a third party.
const localGermanVoice = () =>
  globalThis.speechSynthesis?.getVoices().find(voice => voice.localService && voice.lang.toLowerCase().startsWith('de'))

// Browsers load their voices asynchronously and announce them with voiceschanged.
const subscribeVoices = (listener: () => void) => {
  globalThis.speechSynthesis?.addEventListener('voiceschanged', listener)

  return () => globalThis.speechSynthesis?.removeEventListener('voiceschanged', listener)
}

const hasLocalGermanVoice = () => Boolean(localGermanVoice())

/*
 * Plays a same-origin clip through a native <audio> element, which loads nothing before the first click and never
 * autoplays (docs/adr/0007). Without a clip it falls back to a local German voice, otherwise it says so.
 */
const AudioButton = ({ src, text, label, onTime, className, visible }: AudioButtonProps) => {
  const t = useTranslations('journal.audio')
  const id = useId()
  const audio = useRef<HTMLAudioElement>(null)
  const [failed, setFailed] = useState(false)
  const speech = useSyncExternalStore(subscribeVoices, hasLocalGermanVoice, () => false)
  const playing = usePlayingId() === id
  const source = src && !failed ? 'file' : speech ? 'speech' : 'none'

  useEffect(() => () => stopPlayback(id), [id])

  // Gloss highlights the spoken group, so it needs the playback position while a clip plays.
  useEffect(() => {
    if (!playing || source !== 'file' || !onTime) return

    let frame = 0

    const tick = () => {
      onTime(audio.current!.currentTime * 1000)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      onTime(null)
    }
  }, [playing, source, onTime])

  const stop = () => {
    if (audio.current) {
      audio.current.pause()
      audio.current.currentTime = 0
    }

    if (source === 'speech') globalThis.speechSynthesis.cancel()
    endPlayback(id)
  }

  const fail = () => {
    setFailed(true)
    endPlayback(id)
  }

  const toggle = () => {
    if (source === 'none') return
    if (playing) return stop()

    startPlayback(id, stop)

    if (source === 'file') {
      // An interrupted play() rejects with AbortError; only real failures switch to the fallback.
      audio.current!.play().catch((error: DOMException) => error.name !== 'AbortError' && fail())

      return
    }

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.lang = 'de-DE'
    utterance.voice = localGermanVoice() ?? null
    utterance.onend = () => endPlayback(id)
    utterance.onerror = () => endPlayback(id)
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }

  return (
    <>
      <button
        type='button'
        className={cn(styles.button, className)}
        aria-label={
          visible
            ? playing
              ? visible.playing
              : visible.idle
            : playing
              ? t('stop')
              : source === 'none'
                ? t('unavailable')
                : label
        }
        aria-disabled={source === 'none' || undefined}
        data-playing={playing || undefined}
        onClick={toggle}
      >
        <svg aria-hidden='true' viewBox='0 0 16 16' className={styles.icon}>
          {playing ? (
            <rect x='4' y='4' width='8' height='8' rx='1' fill='currentColor' />
          ) : source === 'none' ? (
            <>
              <path d='M2.5 6H5l3.5-3v10L5 10H2.5z' fill='currentColor' />
              <path d='m10.5 6 3.5 4m0-4-3.5 4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
            </>
          ) : (
            <path d='M5 3v10l8-5z' fill='currentColor' />
          )}
        </svg>
        {visible && <span>{playing ? visible.playing : visible.idle}</span>}
      </button>
      {src && <audio ref={audio} src={src} preload='none' onEnded={() => endPlayback(id)} onError={fail} />}
    </>
  )
}

export default AudioButton
