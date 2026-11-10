'use client'

import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import { useModKey } from '@/hooks/use-mod-key'
import { Link } from '@/i18n/navigation'
import { prefersReducedMotion } from '@/lib/actions'
import { cn } from '@/lib/utils'

import styles from './journal.module.css'

type Item = Readonly<{
  key: string
  titleId: string

  // Lower-case title and tags, for the quick-open filter.
  search: string
  category: string
  node: ReactNode
}>

type JournalEditorsProps = Readonly<{
  items: readonly Item[]
  categories: readonly Readonly<{ id: string; label: string }>[]

  // The inside of the last card, which links to the index.
  last: ReactNode
}>

const ALL = 'all'

// With fewer posts than this there is nothing to filter.
const FILTER_FROM = 3

type Scroll = Readonly<{ overflow: boolean; start: boolean; end: boolean }>

// The open editors: a header like VS Code's, a quick-open filter and category chips from three posts on, and a row of
// cards that scrolls and snaps. The cards are server-rendered; this only filters, scrolls and moves focus.
const JournalEditors = ({ items, categories, last }: JournalEditorsProps) => {
  const t = useTranslations('journal.home')
  const modKey = useModKey()
  const id = useId()
  const section = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL)
  const [active, setActive] = useState(items[0].key)
  const [scroll, setScroll] = useState<Scroll>({ overflow: false, start: true, end: true })
  const filtering = items.length >= FILTER_FROM
  const needle = query.trim().toLowerCase()

  const shown = items.map(
    item =>
      !filtering || ((category === ALL || item.category === category) && (!needle || item.search.includes(needle)))
  )

  const count = shown.filter(Boolean).length

  // The card with the focus stop is the one that was focused last, or else the first one that is shown.
  const firstShown = items.find((_, index) => shown[index])?.key ?? 'all'
  const activeShown = active === 'all' || shown[items.findIndex(item => item.key === active)]
  const focusStop = activeShown ? active : firstShown

  // Ctrl or Cmd P filters the posts while the section is on screen. Elsewhere the browser keeps its print dialog.
  useEffect(() => {
    if (!filtering) return

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey || event.key.toLowerCase() !== 'p') return

      const box = section.current?.getBoundingClientRect()

      if (!box || box.bottom < 0 || box.top > window.innerHeight) return

      event.preventDefault()
      input.current?.focus()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [filtering])

  // The previous and next buttons only matter while the row overflows; their space is reserved either way.
  useEffect(() => {
    const element = list.current

    if (!element) return

    let frame = 0

    const measure = () => {
      frame = 0

      const overflow = element.scrollWidth > element.clientWidth + 1
      const start = element.scrollLeft <= 1
      const end = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1

      setScroll(current =>
        current.overflow === overflow && current.start === start && current.end === end
          ? current
          : { overflow, start, end }
      )
    }

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure)
    }

    schedule()
    element.addEventListener('scroll', schedule, { passive: true })

    const observer = new ResizeObserver(schedule)

    observer.observe(element)

    return () => {
      window.cancelAnimationFrame(frame)
      element.removeEventListener('scroll', schedule)
      observer.disconnect()
    }
  }, [count])

  const page = (direction: -1 | 1) => {
    const element = list.current

    if (!element) return

    const card = element.querySelector<HTMLElement>('li:not([hidden])')
    const step = (card?.getBoundingClientRect().width ?? 300) + 16

    element.scrollBy({ left: direction * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  // Roving focus: Left and Right move between the cards, Enter opens the one in focus.
  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const target = event.target

    if (!(target instanceof HTMLElement) || !target.matches('[data-card]')) return

    const cards = [...event.currentTarget.querySelectorAll<HTMLElement>('[data-card]')].filter(
      card => !card.closest('li')?.hidden
    )

    const index = cards.indexOf(target)
    const move = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: cards.length - 1 }[event.key]

    if (move !== undefined) {
      event.preventDefault()
      cards[Math.min(cards.length - 1, Math.max(0, move))]?.focus()
    } else if (event.key === 'Enter' && target.getAttribute('role') === 'group') {
      target.querySelector<HTMLElement>('[data-open] a')?.click()
    }
  }

  return (
    <div ref={section} className={styles.editors} data-shell-ui=''>
      <div className={styles.head}>
        <h3 className={styles.panelTitle}>
          <span aria-hidden='true'>▾ </span>
          {t('openEditors')} ({items.length})
        </h3>
        <div className={cn(styles.pager, !scroll.overflow && styles.pagerOff)}>
          <button
            type='button'
            className={styles.pagerButton}
            aria-label={t('previous')}
            aria-controls={`${id}-row`}
            aria-disabled={scroll.start || undefined}
            tabIndex={scroll.overflow ? undefined : -1}
            onClick={() => page(-1)}
          >
            <span aria-hidden='true'>←</span>
          </button>
          <button
            type='button'
            className={styles.pagerButton}
            aria-label={t('next')}
            aria-controls={`${id}-row`}
            aria-disabled={scroll.end || undefined}
            tabIndex={scroll.overflow ? undefined : -1}
            onClick={() => page(1)}
          >
            <span aria-hidden='true'>→</span>
          </button>
        </div>
      </div>

      {filtering && (
        <div className={styles.filter}>
          <label className={styles.quickOpen}>
            <span aria-hidden='true' className={styles.chevron}>
              ›
            </span>
            <span className='sr-only'>{t('quickOpenLabel')}</span>
            <input
              ref={input}
              type='text'
              value={query}
              placeholder={t('quickOpen')}
              autoComplete='off'
              spellCheck={false}
              aria-keyshortcuts='Control+P Meta+P'
              onChange={event => setQuery(event.target.value)}
            />
            <kbd aria-hidden='true'>{modKey} P</kbd>
          </label>
          <div role='group' aria-label={t('categories')} className={styles.chips}>
            {[{ id: ALL, label: t('all') }, ...categories].map(chip => (
              <button
                key={chip.id}
                type='button'
                className={styles.chip}
                aria-pressed={category === chip.id}
                onClick={() => setCategory(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
          <p role='status' className={styles.noMatch}>
            {count === 0 ? t('noMatch') : ''}
          </p>
        </div>
      )}

      {/* The list itself scrolls, so it is a focusable region for keyboard users. */}
      <ul ref={list} id={`${id}-row`} className={styles.row} onKeyDown={onKeyDown}>
        {items.map((item, index) => (
          <li key={item.key} hidden={!shown[index]} className={styles.item}>
            <div
              data-card=''
              role='group'
              aria-labelledby={item.titleId}
              tabIndex={focusStop === item.key ? 0 : -1}
              className={styles.cardFocus}
              onFocus={event => event.target === event.currentTarget && setActive(item.key)}
            >
              {item.node}
            </div>
          </li>
        ))}
        <li className={styles.item}>
          <Link
            href='/blog'
            data-card=''
            tabIndex={focusStop === 'all' ? 0 : -1}
            className={styles.cardFocus}
            onFocus={event => event.target === event.currentTarget && setActive('all')}
          >
            {last}
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default JournalEditors
