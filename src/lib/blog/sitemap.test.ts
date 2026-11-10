import { describe, expect, it } from 'vitest'

import type { PublishedPost } from './posts'
import type { PostLanguage } from './schema'
import { journalSitemap } from './sitemap'

const post = (slug: string, lang: PostLanguage, date: string, updated?: string): PublishedPost => ({
  slug,
  Content: () => null,
  outline: [],
  learning: null,
  audio: null,
  metadata: {
    title: 'Title',
    description: 'Description',
    date,
    ...(updated && { updated }),
    category: 'engineering',
    format: 'note',
    tags: [],
    draft: false,
    lang
  }
})

describe('journalSitemap', () => {
  it('lists nothing while the journal is empty, so noindex indexes stay out', () => {
    expect(journalSitemap([])).toEqual([])
  })

  it('lists both indexes and only published translations with content-based lastmod', () => {
    const entries = journalSitemap([post('one', 'en', '2026-11-01', '2026-11-05'), post('two', 'de', '2026-11-03')])

    expect(entries.map(entry => [entry.url, entry.lastModified])).toEqual([
      ['https://kamycoding.com/blog', '2026-11-05'],
      ['https://kamycoding.com/de/blog', '2026-11-05'],
      ['https://kamycoding.com/blog/one', '2026-11-05'],
      ['https://kamycoding.com/de/blog/two', '2026-11-03']
    ])
  })

  it('never lists the notice of a missing translation and links only real translations', () => {
    const entries = journalSitemap([post('one', 'de', '2026-11-01')])
    const article = entries.find(entry => entry.url.endsWith('/one'))

    expect(entries.some(entry => entry.url === 'https://kamycoding.com/blog/one')).toBe(false)
    expect(article?.alternates?.languages).toEqual({
      de: 'https://kamycoding.com/de/blog/one',
      'x-default': 'https://kamycoding.com/de/blog/one'
    })
  })

  it('links both translations and prefers English as x-default', () => {
    const article = journalSitemap([post('one', 'en', '2026-11-01'), post('one', 'de', '2026-11-02')]).find(
      entry => entry.url === 'https://kamycoding.com/de/blog/one'
    )

    expect(article?.alternates?.languages).toEqual({
      en: 'https://kamycoding.com/blog/one',
      de: 'https://kamycoding.com/de/blog/one',
      'x-default': 'https://kamycoding.com/blog/one'
    })
  })
})
