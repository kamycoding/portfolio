'use client'

import { Fragment, type ReactNode, useSyncExternalStore } from 'react'

import { displayPath, type RouteCandidate, suggestRoute, tabName } from '@/lib/not-found'

import styles from './not-found.module.css'

const subscribe = () => () => {}

// Every 404 serves the same static HTML, so the path is read in the browser; the server render shows the fallbacks.
const usePath = () =>
  useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => null
  )

// Fills "{name}" placeholders in a translated sentence with links, which are only ever routes the site knows.
const fill = (template: string, links: Readonly<Record<string, string>>) =>
  template.split(/\{(\w+)\}/).map((part, index): ReactNode =>
    index % 2 === 0 ? (
      <Fragment key={index}>{part}</Fragment>
    ) : (
      <a key={index} href={links[part]}>
        {links[part]}
      </a>
    )
  )

export const MissingTab = () => {
  const path = usePath()

  return (
    <div className={styles.tab}>
      <span className={styles.tabName}>{path ? tabName(path) : '404.tsx'}</span>
      <span className={styles.close}>×</span>
    </div>
  )
}

type MissingDetailsProps = Readonly<{
  candidates: readonly RouteCandidate[]
  suggestion: string
  fallback: string
  homeHref: string
  journalHref: string
}>

// One line each, so filling in the path after hydration never moves the page.
export const MissingDetails = ({ candidates, suggestion, fallback, homeHref, journalHref }: MissingDetailsProps) => {
  const path = usePath()
  const route = path ? suggestRoute(path, candidates) : null

  return (
    <div className={styles.error}>
      {/* Compiler output stays English in both languages, like the real thing. */}
      <p lang='en' className={styles.line}>
        <span aria-hidden='true' className={styles.glyph}>
          ×
        </span>
        {path ? `Module not found: Can't resolve '${displayPath(path)}'` : "Module not found: Can't resolve this path"}
      </p>
      <p className={styles.hint}>
        {route ? fill(suggestion, { route }) : fill(fallback, { home: homeHref, journal: journalHref })}
      </p>
    </div>
  )
}
