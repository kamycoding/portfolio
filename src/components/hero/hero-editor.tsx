'use client'

import { type KeyboardEvent, type MouseEvent, useEffect, useId, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import Cat from '@/components/cat/cat'
import { useCat } from '@/hooks/use-cat'
import { useIntroRun } from '@/hooks/use-ready'
import { cn } from '@/lib/utils'

import {
  CAT_LINE,
  type Comments,
  kamyarLines,
  type PropKey,
  TIP_SIGNATURES,
  type Token,
  typesLines
} from './editor-code'
import Terminal from './terminal'

import styles from './hero.module.css'

type Doc = 'kamyar' | 'types'

const DOCS: ReadonlyArray<{ id: Doc; file: string; path: string }> = [
  { id: 'kamyar', file: 'kamyar.ts', path: 'src/people/kamyar.ts' },
  { id: 'types', file: 'types.ts', path: 'src/types/index.ts' }
]

// The lines fade in once per page load; after a language switch the code appears instantly, like the prototype.
let shownBefore = false

const TOKEN_CLASS: Record<Token['kind'], string | undefined> = {
  kw: styles.kw,
  str: styles.str,
  prop: styles.prop,
  pun: styles.pun,
  com: styles.com,
  plain: undefined
}

type Tip = Readonly<{ key: PropKey; left: number; top: number }>

const HeroEditor = () => {
  const t = useTranslations('hero.editor')
  const { awake, wakes } = useCat()
  const [doc, setDoc] = useState<Doc>('kamyar')
  const [animate, setAnimate] = useState(() => !shownBefore)
  const run = useIntroRun()
  const [seenRun, setSeenRun] = useState(run)
  const [tip, setTip] = useState<Tip | null>(null)
  const [tipOpen, setTipOpen] = useState(false)
  const [cursor, setCursor] = useState('Ln 1, Col 1')
  const rootRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const tipId = useId()
  const panelId = useId()

  useEffect(() => {
    shownBefore = true
  }, [])

  // A replayed intro writes the code in again (prototype typeCode); the run in the line keys restarts the animation.
  if (run !== seenRun) {
    setSeenRun(run)

    if (run > 1) setAnimate(true)
  }

  const comments: Comments = {
    role: t('comments.role'),
    building: t('comments.building'),
    background: t('comments.background'),
    cat: t('comments.cat'),
    awake: t('comments.awake'),
    types: t('comments.types')
  }

  const lines = doc === 'kamyar' ? kamyarLines(comments, awake) : typesLines(comments)
  const current = DOCS.find(item => item.id === doc)!

  const selectDoc = (next: Doc) => {
    setDoc(next)
    setAnimate(false)
    setTipOpen(false)
  }

  // Arrow keys move between the two file tabs (WAI-ARIA tabs pattern).
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()

    const next = (index + (event.key === 'ArrowRight' ? 1 : DOCS.length - 1)) % DOCS.length

    selectDoc(DOCS[next].id)
    tabRefs.current[next]?.focus()
  }

  const showTip = (key: PropKey, target: HTMLElement) => {
    const root = rootRef.current

    if (!root) return

    const rootBox = root.getBoundingClientRect()
    const box = target.getBoundingClientRect()

    // Same placement as the prototype: below the word, kept inside the editor.
    setTip({
      key,
      left: Math.max(8, Math.min(box.left - rootBox.left, rootBox.width - 310)),
      top: box.bottom - rootBox.top + 8
    })
    setTipOpen(true)
  }

  const onCodeMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const line = (event.target as HTMLElement).closest<HTMLElement>('[data-line]')

    if (!line) return

    const column = Math.max(1, Math.round((event.clientX - line.getBoundingClientRect().left - 46) / 8.1))

    setCursor(`Ln ${Number(line.dataset.line) + 1}, Col ${column}`)
  }

  return (
    <div ref={rootRef} data-hero-editor='' data-shell-ui='' className={styles.editor}>
      <Cat className={styles.cat} />

      <div role='tablist' aria-label={t('filesLabel')} className={styles.edHead}>
        {DOCS.map((item, index) => (
          <button
            key={item.id}
            ref={element => {
              tabRefs.current[index] = element
            }}
            type='button'
            role='tab'
            aria-selected={doc === item.id}
            aria-controls={panelId}
            tabIndex={doc === item.id ? 0 : -1}
            onClick={() => selectDoc(item.id)}
            onKeyDown={event => onTabKeyDown(event, index)}
            className={styles.edTab}
          >
            <span className={styles.badge}>TS</span>
            {item.file}
          </button>
        ))}
        <div className={styles.edPath}>{current.path}</div>
      </div>

      <div
        id={panelId}
        role='tabpanel'
        aria-label={current.file}
        className={styles.code}
        data-cursor='text'
        onMouseMove={onCodeMouseMove}
      >
        {/* The cat line's key changes on every wake-up, which restarts its flash animation. */}
        {lines.map((tokens, index) => (
          <div
            key={index === CAT_LINE ? `${run}-${index}-${wakes}` : `${run}-${index}`}
            data-line={index}
            className={cn(
              styles.line,
              animate && styles.lineIn,
              doc === 'kamyar' && index === CAT_LINE && awake && styles.flash
            )}
            style={animate ? { animationDelay: `${380 + index * 60}ms` } : undefined}
          >
            <span className={styles.n}>{index + 1}</span>
            <span>
              {tokens.length === 0 && ' '}
              {tokens.map((token, tokenIndex) =>
                token.tip ? (
                  <span
                    key={tokenIndex}
                    tabIndex={0}
                    aria-describedby={tipOpen && tip?.key === token.tip ? tipId : undefined}
                    className={cn(styles.prop, styles.hov)}
                    onMouseEnter={event => showTip(token.tip!, event.currentTarget)}
                    onMouseLeave={() => setTipOpen(false)}
                    onFocus={event => showTip(token.tip!, event.currentTarget)}
                    onBlur={() => setTipOpen(false)}
                  >
                    {token.text}
                  </span>
                ) : (
                  <span key={tokenIndex} className={TOKEN_CLASS[token.kind]}>
                    {token.text}
                  </span>
                )
              )}
              {index === lines.length - 1 && <span aria-hidden='true' className={styles.cc} />}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.edFoot}>
        <span>
          <span className={styles.ok}>✓</span> {t('problems')}
        </span>
        <span>{cursor}</span>
      </div>

      <Terminal />

      <div
        id={tipId}
        role='tooltip'
        className={cn(styles.tip, tipOpen && styles.tipShow)}
        style={tip ? { left: tip.left, top: tip.top } : undefined}
      >
        {/* The last card stays filled while it fades out. */}
        {tip && (
          <>
            <div className={styles.sig}>{TIP_SIGNATURES[tip.key]}</div>
            {t(`tips.${tip.key}`)}
          </>
        )}
      </div>
    </div>
  )
}

export default HeroEditor
