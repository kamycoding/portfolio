'use client'

import { useState } from 'react'

import { useTranslations } from 'next-intl'

import AudioButton, { type ClipAudio } from './audio-button'
import styles from './learning.module.css'

type DialogProps = Readonly<{
  title?: string
  lines: ReadonlyArray<Readonly<{ speaker: string; de: string; en: string; audio: ClipAudio }>>
}>

// German first; the English lines are in the HTML from the start and only unhidden, so nothing reflows on load.
const Dialog = ({ title, lines }: DialogProps) => {
  const t = useTranslations('journal')
  const [english, setEnglish] = useState(false)

  return (
    <figure className={styles.dialog}>
      {title && <figcaption className={styles.dialogTitle}>{title}</figcaption>}
      <div className={styles.controls}>
        <button type='button' className={styles.button} aria-pressed={english} onClick={() => setEnglish(!english)}>
          <span aria-hidden='true' className={styles.check}>
            {english ? '✓' : ''}
          </span>
          {t('showEnglish')}
        </button>
      </div>
      <ol className={styles.lines}>
        {lines.map((line, index) => (
          <li key={index} className={styles.line}>
            <span className={styles.speaker}>
              {line.speaker}
              <span className='sr-only'>:</span>
            </span>
            <p lang='de' className={styles.german}>
              {line.de}
            </p>
            <span className={styles.lineAudio}>
              <AudioButton {...line.audio} label={t('audio.line', { number: index + 1, speaker: line.speaker })} />
            </span>
            <p lang='en' className={styles.english} hidden={!english}>
              {line.en}
            </p>
          </li>
        ))}
      </ol>
    </figure>
  )
}

export default Dialog
