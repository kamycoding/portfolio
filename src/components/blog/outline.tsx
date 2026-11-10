'use client'

import { useId, useRef } from 'react'

import { useTranslations } from 'next-intl'

import { jumpNarrationTo, useNarration } from '@/hooks/use-narration'
import { nestOutline, type OutlineNode } from '@/lib/blog/reading'
import type { OutlineItem } from '@/lib/blog/schema'
import { cn } from '@/lib/utils'

import styles from './blog.module.css'

type ListProps = Readonly<{
  nodes: readonly (OutlineNode | OutlineItem)[]
  activeId: string | null

  // The section the narration is on, and whether it is playing.
  narrating: Readonly<{ current: string | null; playing: boolean }>
}>

// aria-current changes are not announced, so scrolling stays silent for screen readers.
const List = ({ nodes, activeId, narrating }: ListProps) => (
  <ul>
    {nodes.map(node => (
      <li key={node.id}>
        <a
          href={`#${node.id}`}
          aria-current={node.id === activeId ? 'location' : undefined}
          data-narrating={node.id === narrating.current || undefined}
          onClick={() => narrating.playing && jumpNarrationTo(node.id)}
        >
          {node.text}
        </a>
        {'children' in node && node.children.length > 0 && (
          <List nodes={node.children} activeId={activeId} narrating={narrating} />
        )}
      </li>
    ))}
  </ul>
)

type OutlineProps = Readonly<{
  outline: readonly OutlineItem[]
  activeId: string | null
  variant: 'aside' | 'contents'
}>

// Both variants are in the server HTML; CSS shows the sticky aside on wide screens, the collapsible one below.
const Outline = ({ outline, activeId, variant }: OutlineProps) => {
  const t = useTranslations('journal')
  const titleId = useId()
  const details = useRef<HTMLDetailsElement>(null)
  const nodes = nestOutline(outline)
  const narrating = useNarration()

  if (variant === 'aside') {
    return (
      <nav aria-labelledby={titleId} className={cn(styles.outline, styles.toc)}>
        <p id={titleId} className={styles.tocTitle}>
          {t('onThisPage')}
        </p>
        <List nodes={nodes} activeId={activeId} narrating={narrating} />
      </nav>
    )
  }

  return (
    <details ref={details} className={styles.contents}>
      <summary>{t('contents')}</summary>

      {/* Close after choosing a heading, before the browser scrolls, so the jump lands on the heading. */}
      <nav
        aria-label={t('contents')}
        className={styles.toc}
        onClick={event => {
          if (event.target instanceof Element && event.target.closest('a') && details.current)
            details.current.open = false
        }}
      >
        <List nodes={nodes} activeId={activeId} narrating={narrating} />
      </nav>
    </details>
  )
}

export default Outline
