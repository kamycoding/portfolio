import { describe, expect, it } from 'vitest'

import de from '../../../messages/de.json'
import en from '../../../messages/en.json'
import { pageMetadata } from '../site'

import { journalIndexMetadata, journalPostMetadata } from './metadata'
import type { PublishedPost } from './posts'

const post: PublishedPost = {
  slug: 'fixture',
  Content: () => null,
  outline: [],
  learning: null,
  audio: null,
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
    expect(journalIndexMetadata('en', 'Journal', 'Fixture', 'Feed', false).robots).toEqual({
      index: false,
      follow: true
    })
    expect(journalIndexMetadata('de', 'Journal', 'Fixture', 'Feed', true).robots).toEqual({ index: true, follow: true })
    expect(journalIndexMetadata('de', 'Journal', 'Fixture', 'Feed', false).alternates).toEqual({
      canonical: '/de/blog',
      languages: { en: '/blog', de: '/de/blog', 'x-default': '/blog' },
      types: { 'application/rss+xml': [{ url: '/de/blog/rss.xml', title: 'Feed' }] }
    })
  })

  it.each([
    ['en', en.journal],
    ['de', de.journal]
  ] as const)('gives the %s index its own search title and description, within the limits', (locale, journal) => {
    const { title, description } = journal.meta
    const result = journalIndexMetadata(locale, title, description, journal.feedTitle, true)

    expect(title.length).toBeLessThanOrEqual(60)
    expect(description.length).toBeLessThanOrEqual(160)
    expect(result).toMatchObject({
      title,
      description,
      openGraph: { title, description },
      twitter: { title, description }
    })

    // The page keeps its short tagline, and the feed keeps its short name.
    expect(journal.description).not.toBe(description)
    expect(journal.feedTitle).toBe('Journal | kamycoding')
  })

  it('shares the homepage image on the indexes, with a large Twitter card', () => {
    const result = journalIndexMetadata('de', 'Journal', 'Fixture', 'Feed', true)

    const image = {
      url: '/de/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'Kamyar Zamanfar, kamycoding.com',
      type: 'image/png'
    }

    expect(result.openGraph).toMatchObject({ type: 'website', images: [image] })
    expect(result.twitter).toEqual({
      card: 'summary_large_image',
      title: 'Journal',
      description: 'Fixture',
      images: [image]
    })
  })

  it('advertises only actual translations and uses English as x-default when available', () => {
    expect(
      journalPostMetadata('en', 'fixture', { kind: 'post', post, languages: ['en'] }, notice, 'Journal | kamycoding')
        .alternates
    ).toEqual({
      canonical: '/blog/fixture',
      languages: { en: '/blog/fixture', 'x-default': '/blog/fixture' },
      types: { 'application/rss+xml': [{ url: '/blog/rss.xml', title: 'Journal | kamycoding' }] }
    })
    expect(
      journalPostMetadata(
        'en',
        'fixture',
        { kind: 'post', post, languages: ['de', 'en'] },
        notice,
        'Journal | kamycoding'
      ).alternates?.languages
    ).toEqual({
      en: '/blog/fixture',
      de: '/de/blog/fixture',
      'x-default': '/blog/fixture'
    })
  })

  it('uses German as x-default for a German-only post', () => {
    const german: PublishedPost = { ...post, metadata: { ...post.metadata, lang: 'de' } }

    expect(
      journalPostMetadata(
        'de',
        'fixture',
        { kind: 'post', post: german, languages: ['de'] },
        notice,
        'Journal | kamycoding'
      ).alternates
    ).toEqual({
      canonical: '/de/blog/fixture',
      languages: { de: '/de/blog/fixture', 'x-default': '/de/blog/fixture' },
      types: { 'application/rss+xml': [{ url: '/de/blog/rss.xml', title: 'Journal | kamycoding' }] }
    })
  })

  it('keeps notices noindex, points to the published version and clears inherited social metadata', () => {
    const result = journalPostMetadata(
      'de',
      'fixture',
      { kind: 'missing', available: post },
      notice,
      'Journal | kamycoding'
    )

    expect(result.robots).toEqual({ index: false, follow: true })
    expect(result.alternates).toEqual({ canonical: '/blog/fixture', languages: {} })
    expect(result.openGraph).toBeNull()
    expect(result.twitter).toBeNull()
  })

  it('marks articles as Open Graph articles with a large Twitter card and the site name in the title', () => {
    const updated: PublishedPost = { ...post, metadata: { ...post.metadata, updated: '2026-11-12', tags: ['next'] } }

    const result = journalPostMetadata(
      'en',
      'fixture',
      { kind: 'post', post: updated, languages: ['en'] },
      notice,
      'Feed'
    )

    expect(result.title).toBe('Metadata fixture | kamycoding')
    expect(result.openGraph).toMatchObject({
      type: 'article',
      title: 'Metadata fixture',
      publishedTime: '2026-11-10T00:00:00+01:00',
      modifiedTime: '2026-11-12T00:00:00+01:00',
      authors: ['https://kamycoding.com'],
      tags: ['next']
    })

    const image = {
      url: '/en/blog/fixture/og.png',
      width: 1200,
      height: 630,
      alt: 'Metadata fixture',
      type: 'image/png'
    }

    expect(result.openGraph).toMatchObject({ images: [image] })
    expect(result.twitter).toEqual({
      card: 'summary_large_image',
      title: 'Metadata fixture',
      description: post.metadata.description,
      images: [image]
    })
  })

  it.each([
    ['The JavaScript Event Loop: Predict the Output', 'The JavaScript Event Loop: Predict the Output | kamycoding'],
    [
      'German for Developers: What People Say in Dailies and Calls',
      'German for Developers: What People Say in Dailies and Calls'
    ],
    ['Der JavaScript-Event-Loop: Sag die Ausgabe voraus', 'Der JavaScript-Event-Loop: Sag die Ausgabe voraus']
  ])('adds the site name to "%s" only while the title stays within 60 characters', (title, expected) => {
    const named: PublishedPost = { ...post, metadata: { ...post.metadata, title } }

    const result = journalPostMetadata(
      'en',
      'fixture',
      { kind: 'post', post: named, languages: ['en'] },
      notice,
      'Feed'
    )

    expect(result.title).toBe(expected)
    expect(expected.length).toBeLessThanOrEqual(60)

    // Social cards never carry the site name in the title.
    expect(result.openGraph).toMatchObject({ title })
  })

  it('uses the Europe/Berlin offset of each day for the Open Graph times, like the JSON-LD', () => {
    const summer: PublishedPost = { ...post, metadata: { ...post.metadata, date: '2026-03-20', updated: '2026-07-01' } }

    const result = journalPostMetadata(
      'en',
      'fixture',
      { kind: 'post', post: summer, languages: ['en'] },
      notice,
      'Feed'
    )

    expect(result.openGraph).toMatchObject({
      publishedTime: '2026-03-20T00:00:00+01:00',
      modifiedTime: '2026-07-01T00:00:00+02:00'
    })
    expect(
      journalPostMetadata('en', 'fixture', { kind: 'post', post, languages: ['en'] }, notice, 'Feed').openGraph
    ).toMatchObject({
      publishedTime: '2026-11-10T00:00:00+01:00',
      modifiedTime: '2026-11-10T00:00:00+01:00'
    })
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
