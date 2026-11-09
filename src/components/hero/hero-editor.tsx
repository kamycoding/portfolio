'use client'

import { type FocusEvent, type KeyboardEvent, type MouseEvent, useEffect, useId, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import Cat from '@/components/cat/cat'
import { animateBuild, getBlueprint, setBuild, subscribeBlueprint } from '@/hooks/use-blueprint'
import { useCat } from '@/hooks/use-cat'
import { useIntroRun, useReady } from '@/hooks/use-ready'
import { prefersReducedMotion } from '@/lib/actions'
import { BUILD_MAX } from '@/lib/blueprint'
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
import Blueprint from './blueprint'
import PlanSlider from './plan-slider'
import Terminal from './terminal'

import styles from './hero.module.css'

type Doc = 'kamyar' | 'types'

const DOCS: ReadonlyArray<{ id: Doc; file: string; path: string }> = [
  { id: 'kamyar', file: 'kamyar.ts', path: 'src/people/kamyar.ts' },
  { id: 'types', file: 'types.ts', path: 'src/types/index.ts' }
]

// The lines fade in once per page load; after a language switch the code appears instantly, like the prototype.
let shownBefore = false

// Intro run whose blueprint-to-build entrance has played, so a language switch does not replay it.
let builtRun = 0

// Entrance timing: starts while the editor fades in, then sweeps the build in from left to right.
const ENTRANCE_DELAY_MS = 250
const ENTRANCE_MS = 1500

const TOKEN_CLASS: Record<Token['kind'], string | undefined> = {
  kw: styles.kw,
  str: styles.str,
  prop: styles.prop,
  pun: styles.pun,
  com: styles.com,
  plain: undefined
}

type Tip = Readonly<{ key: PropKey; left: number; top: number }>

type HeroEditorProps = Readonly<{
  buildDate: string
}>

const HeroEditor = ({ buildDate }: HeroEditorProps) => {
  const t = useTranslations('hero.editor')
  const { awake, wakes } = useCat()
  const [doc, setDoc] = useState<Doc>('kamyar')
  const [animate, setAnimate] = useState(() => !shownBefore)
  const run = useIntroRun()
  const ready = useReady()
  const [seenRun, setSeenRun] = useState(run)
  const [tip, setTip] = useState<Tip | null>(null)
  const [tipOpen, setTipOpen] = useState(false)
  const [cursor, setCursor] = useState('Ln 1, Col 1')
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const tipId = useId()
  const panelId = useId()

  useEffect(() => {
    shownBefore = true
  }, [])

  // The slider position drives CSS variables directly, so a drag never re-renders the code.
  useEffect(() => {
    const root = rootRef.current

    if (!root) return

    const apply = () => {
      const { build } = getBlueprint()

      root.style.setProperty('--hx', `${build}%`)

      // At rest the clip edge moves past the frame, so the shadow and the cat are never cut.
      root.style.setProperty('--bx', build >= BUILD_MAX ? 'calc(100% + 400px)' : `${build}%`)

      // With the full plan the build keeps no sliver of shadow on its left.
      root.style.setProperty('--fl', build <= 0 ? '0px' : '-400px')
    }

    apply()

    return subscribeBlueprint(apply)
  }, [])

  // Each intro shows the plan first and builds it after the intro ends; reduced motion keeps the build.
  useEffect(() => {
    if (prefersReducedMotion()) return

    if (!ready) {
      setBuild(0)

      return
    }

    if (run === builtRun) return

    builtRun = run
    animateBuild(BUILD_MAX, ENTRANCE_MS, ENTRANCE_DELAY_MS)
  }, [ready, run])

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

  // Keyboard focus inside the editor brings the build back, so a focused control is never hidden under the plan.
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    const { build, dragging } = getBlueprint()

    if (build < BUILD_MAX && !dragging && event.target.matches(':focus-visible')) animateBuild(BUILD_MAX)
  }

  const onCodeMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const line = (event.target as HTMLElement).closest<HTMLElement>('[data-line]')

    if (!line) return

    const column = Math.max(1, Math.round((event.clientX - line.getBoundingClientRect().left - 46) / 8.1))

    setCursor(`Ln ${Number(line.dataset.line) + 1}, Col ${column}`)
  }

  return (
    <div ref={rootRef} data-hero-editor='' data-shell-ui='' className={styles.editor}>
      <div ref={frameRef} className={styles.frame} onFocus={onFocus}>
        <Cat className={styles.cat} />

        <div role='tablist' aria-label={t('filesLabel')} className={styles.edHead} data-bp='head'>
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
          data-bp='code'
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

        <div className={styles.edFoot} data-bp='foot'>
          <span>
            <span className={styles.ok}>✓</span> {t('problems')}
          </span>
          <span>{cursor}</span>
        </div>

        <Terminal />

        {/* Empty until the first hover card, and an empty tooltip has no accessible name. */}
        <div
          id={tipId}
          role={tip ? 'tooltip' : undefined}
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

      <Blueprint frameRef={frameRef} buildDate={buildDate} contentKey={`${doc}-${awake}`} />
      <PlanSlider rootRef={rootRef} />
    </div>
  )
}

export default HeroEditor
