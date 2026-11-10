import { describe, expect, it } from 'vitest'

import { pageMetadata } from '../site'

import { journalIndexMetadata, journalPostMetadata } from './metadata'
import type { PublishedPost } from './posts'

const post: PublishedPost = {
  slug: 'fixture',
  Content: () => null,
  outline: [],
  metadata: {
    title: 'Metadata fixture',
    description: 'Metadata fixture.',
    date: '2026-11-10',
    category: 'learning',
    format: 'note',
    tags: [],
    draft: false,
    lang: 'en'
  }
}

const notice = { title: 'Translation unavailable', description: 'Read the published language version.' }

describe('journal metadata', () => {
  it('keeps empty indexes noindex and enables indexing when posts exist', () => {
    expect(journalIndexMetadata('en', 'Journal', 'Fixture', false).robots).toEqual({ index: false, follow: true })
    expect(journalIndexMetadata('de', 'Journal', 'Fixture', true).robots).toEqual({ index: true, follow: true })
    expect(journalIndexMetadata('de', 'Journal', 'Fixture', false).alternates).toEqual({
      canonical: '/de/blog',
      languages: { en: '/blog', de: '/de/blog', 'x-default': '/blog' }
    })
  })

  it('advertises only actual translations and uses English as x-default when available', () => {
    expect(journalPostMetadata('en', 'fixture', { kind: 'post', post, languages: ['en'] }, notice).alternates).toEqual({
      canonical: '/blog/fixture',
      languages: { en: '/blog/fixture', 'x-default': '/blog/fixture' }
    })
    expect(
      journalPostMetadata('en', 'fixture', { kind: 'post', post, languages: ['de', 'en'] }, notice).alternates
        ?.languages
    ).toEqual({
      en: '/blog/fixture',
      de: '/de/blog/fixture',
      'x-default': '/blog/fixture'
    })
  })

  it('uses German as x-default for a German-only post', () => {
    const german: PublishedPost = { ...post, metadata: { ...post.metadata, lang: 'de' } }

    expect(
      journalPostMetadata('de', 'fixture', { kind: 'post', post: german, languages: ['de'] }, notice).alternates
    ).toEqual({
      canonical: '/de/blog/fixture',
      languages: { de: '/de/blog/fixture', 'x-default': '/de/blog/fixture' }
    })
  })

  it('keeps notices noindex, points to the published version and clears inherited social metadata', () => {
    const result = journalPostMetadata('de', 'fixture', { kind: 'missing', available: post }, notice)

    expect(result.robots).toEqual({ index: false, follow: true })
    expect(result.alternates).toEqual({ canonical: '/blog/fixture', languages: {} })
    expect(result.openGraph).toBeNull()
    expect(result.twitter).toBeNull()
  })

  it('leaves existing homepage and legal-page alternates intact', () => {
    for (const path of ['/', '/legal-notice', '/privacy-policy']) {
      const metadata = pageMetadata({ locale: 'de', path, title: 'Fixture' })

      expect(metadata.alternates?.languages).toEqual({
        en: path,
        de: path === '/' ? '/de' : `/de${path}`,
        'x-default': path
      })
    }
  })
})
