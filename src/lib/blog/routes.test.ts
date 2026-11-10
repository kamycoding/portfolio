import { describe, expect, it } from 'vitest'

import { localePath } from '../site'

import type { PublishedPost } from './posts'
import {
  isJournalRoute,
  journalFile,
  journalIndexPosts,
  journalStaticParams,
  resolvePostRoute,
  withoutLocalePrefix
} from './routes'
import type { PostLanguage } from './schema'

const post = (slug: string, lang: PostLanguage, date = '2026-11-10'): PublishedPost => ({
  slug,
  Content: () => null,
  outline: [],
  learning: null,
  metadata: {
    title: 'Route fixture',
    description: 'Route fixture.',
    date,
    category: 'learning',
    format: 'note',
    tags: [],
    draft: false,
    lang
  }
})

describe('journal paths', () => {
  it.each(['/blog', '/blog/', '/blog/fixture', '/de/blog', '/de/blog/fixture', '/en/blog/fixture'])(
    'recognizes journal route %s',
    pathname => {
      expect(isJournalRoute(pathname)).toBe(true)
    }
  )

  it.each(['/', '/de', '/blogger', '/de/blogger', '/legal-notice', '/de/privacy-policy'])(
    'preserves non-journal route %s',
    pathname => {
      expect(isJournalRoute(pathname)).toBe(false)
    }
  )

  it('switches journal languages without leaving an English prefix', () => {
    for (const path of ['/blog/fixture', '/de/blog/fixture', '/en/blog/fixture']) {
      expect(localePath('en', withoutLocalePrefix(path))).toBe('/blog/fixture')
      expect(localePath('de', withoutLocalePrefix(path))).toBe('/de/blog/fixture')
    }

    expect(withoutLocalePrefix('/de')).toBe('/')
    expect(journalFile('/blog', 'en')).toBe('blog/')
    expect(journalFile('/de/blog/', 'de')).toBe('blog/')
    expect(journalFile('/de/blog/fixture', 'de')).toBe('de.mdx')
  })
})

describe('published journal routes', () => {
  it('supports the empty registry without placeholder routes or posts', () => {
    expect(journalStaticParams([])).toEqual([])
    expect(journalIndexPosts([], 'de')).toEqual([])
    expect(resolvePostRoute([], 'unknown', 'de')).toEqual({ kind: 'unknown' })
  })

  it('generates each published slug once for the parent locale routes', () => {
    expect(journalStaticParams([post('fixture', 'en'), post('fixture', 'de')])).toEqual([{ slug: 'fixture' }])
  })

  it('distinguishes an unavailable translation from an unknown slug', () => {
    const english = post('fixture', 'en')

    expect(resolvePostRoute([english], 'fixture', 'de')).toEqual({ kind: 'missing', available: english })
    expect(resolvePostRoute([english], 'missing', 'en')).toEqual({ kind: 'unknown' })
    expect(resolvePostRoute([english], 'fixture', 'en')).toEqual({ kind: 'post', post: english, languages: ['en'] })
  })

  it('uses German as the available version for German-only posts', () => {
    const german = post('fixture', 'de')

    expect(resolvePostRoute([german], 'fixture', 'en')).toEqual({ kind: 'missing', available: german })
  })

  it('lists one translation per slug, prefers the selected language and retains other-language posts', () => {
    const english = post('fixture', 'en')
    const german = post('fixture', 'de', '2026-11-09')
    const other = post('other', 'en', '2026-11-08')

    expect(journalIndexPosts([english, german, other], 'de')).toEqual([german, other])
    expect(journalIndexPosts([english, german, other], 'en')).toEqual([english, other])
  })
})
