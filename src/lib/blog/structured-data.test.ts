import { describe, expect, it } from 'vitest'

import { personNode } from '../structured-data'

import type { PublishedPost } from './posts'
import { articleGraph, serializeJsonLd } from './structured-data'

const post: PublishedPost = {
  slug: 'fixture',
  Content: () => null,
  outline: [],
  learning: null,
  audio: null,
  metadata: {
    title: 'Fixture </script> title',
    description: 'Description',
    date: '2026-11-10',
    category: 'engineering',
    format: 'note',
    tags: ['next', 'mdx'],
    draft: false,
    lang: 'de'
  }
}

const author = { jobTitle: 'Full-Stack Developer', description: 'Full-Stack-Entwickler bei Köln.' }

const options = {
  journalName: 'Journal',
  jobTitle: author.jobTitle,
  authorDescription: author.description,
  section: 'Softwareentwicklung'
}

const graph = articleGraph({ post, ...options })

const [article, breadcrumb, person] = graph['@graph'] as Record<string, unknown>[]

describe('articleGraph', () => {
  it('describes the translation as a BlogPosting by the site author', () => {
    expect(article).toMatchObject({
      '@type': 'BlogPosting',
      headline: post.metadata.title,
      datePublished: '2026-11-10T00:00:00+01:00',
      dateModified: '2026-11-10T00:00:00+01:00',
      inLanguage: 'de',
      url: 'https://kamycoding.com/de/blog/fixture',
      image: 'https://kamycoding.com/de/blog/fixture/og.png',
      keywords: 'next, mdx',
      articleSection: 'Softwareentwicklung',
      author: { '@id': 'https://kamycoding.com/#person' }
    })
  })

  it('uses the updated day as dateModified, each with the offset of its own day', () => {
    const summer: PublishedPost = { ...post, metadata: { ...post.metadata, date: '2026-03-20', updated: '2026-07-01' } }
    const [updated] = articleGraph({ post: summer, ...options })['@graph']

    expect(updated).toMatchObject({
      datePublished: '2026-03-20T00:00:00+01:00',
      dateModified: '2026-07-01T00:00:00+02:00'
    })
  })

  it('adds the breadcrumb trail and the same Person as the homepage', () => {
    expect(breadcrumb).toMatchObject({ '@type': 'BreadcrumbList' })
    expect((breadcrumb.itemListElement as { item: string }[]).map(item => item.item)).toEqual([
      'https://kamycoding.com/de',
      'https://kamycoding.com/de/blog',
      'https://kamycoding.com/de/blog/fixture'
    ])
    expect(person).toEqual(personNode(author))
    expect(person['@id']).toBe((article.author as { '@id': string })['@id'])
  })

  it('serializes to JSON that cannot close the script element', () => {
    const json = serializeJsonLd(graph)

    expect(json).not.toContain('<')
    expect(JSON.parse(json)).toEqual(graph)
  })
})
