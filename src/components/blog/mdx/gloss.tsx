'use client'

import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import type { SegmentTime } from '@/lib/blog/audio'
import type { GlossSegment } from '@/lib/blog/learning'
import { cn } from '@/lib/utils'

import AudioButton, { type ClipAudio } from './audio-button'
import styles from './learning.module.css'

type GlossProps = Readonly<{
  de: readonly GlossSegment[]
  en: readonly GlossSegment[]
  audio: ClipAudio
  times: readonly SegmentTime[] | null
}>

// The group whose aligned segment is being spoken; gaps between segments highlight nothing.
const spokenGroup = (de: readonly GlossSegment[], times: readonly SegmentTime[] | null, position: number | null) => {
  if (position === null || !times) return null

  const index = times.findIndex(time => time && position >= time.start && position <= time.end)
  const segment = de[index]

  return segment && typeof segment !== 'string' ? segment.group : null
}

// Authored word-group alignment (docs/adr/0007): hovering, focusing or pinning a group highlights it in both lines.
const Gloss = ({ de, en, audio, times }: GlossProps) => {
  const t = useTranslations('journal')
  const id = useId()
  const figure = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [position, setPosition] = useState<number | null>(null)
  const active = spokenGroup(de, times, position) ?? hovered ?? focused ?? pinned

  // Delegated pointer tracking, so the English parts highlight on hover without becoming controls themselves.
  useEffect(() => {
    const element = figure.current!

    const over = (event: PointerEvent) =>
      setHovered((event.target as Element).closest<HTMLElement>('[data-group]')?.dataset.group ?? null)

    const leave = () => setHovered(null)

    element.addEventListener('pointerover', over)
    element.addEventListener('pointerleave', leave)

    return () => {
      element.removeEventListener('pointerover', over)
      element.removeEventListener('pointerleave', leave)
    }
  }, [])

  const englishIds = (group: string) =>
    en.flatMap((segment, index) =>
      typeof segment !== 'string' && segment.group === group ? [`${id}-en-${index}`] : []
    )

  const unpin = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && pinned) setPinned(null)
  }

  // Only the first part of each German group is a button, so a split verb like "rufe … an" is one tab stop.
  const controls = new Set<string>()

  return (
    <figure ref={figure} className={styles.gloss} aria-label={t('gloss')}>
      <p lang='de' className={styles.glossDe}>
        {de.map((segment, index) => {
          if (typeof segment === 'string') return segment

          const { text, group } = segment
          const isActive = group === active || undefined

          if (controls.has(group)) {
            return (
              <span key={index} className={styles.segment} data-group={group} data-active={isActive}>
                {text}
              </span>
            )
          }

          controls.add(group)

          return (
            <button
              key={index}
              type='button'
              className={cn(styles.segment, styles.control)}
              data-group={group}
              data-active={isActive}
              aria-pressed={pinned === group}
              aria-describedby={englishIds(group).join(' ')}
              onFocus={() => setFocused(group)}
              onBlur={() => setFocused(null)}
              onClick={() => setPinned(current => (current === group ? null : group))}
              onKeyDown={unpin}
            >
              {text}
            </button>
          )
        })}
      </p>
      <p lang='en' className={styles.glossEn}>
        {en.map((segment, index) =>
          typeof segment === 'string' ? (
            segment
          ) : (
            <span
              key={index}
              id={`${id}-en-${index}`}
              className={styles.segment}
              data-group={segment.group}
              data-active={segment.group === active || undefined}
            >
              {segment.text}
            </span>
          )
        )}
      </p>
      <div className={styles.glossAudio}>
        <AudioButton {...audio} label={t('audio.sentence')} onTime={setPosition} />
      </div>
    </figure>
  )
}

export default Gloss
