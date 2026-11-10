import { describe, expect, it } from 'vitest'

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

const graph = articleGraph({
  post,
  journalName: 'Journal',
  jobTitle: 'Full-Stack Developer',
  section: 'Softwareentwicklung'
})

const [article, breadcrumb, person] = graph['@graph'] as Record<string, unknown>[]

describe('articleGraph', () => {
  it('describes the translation as a BlogPosting by the site author', () => {
    expect(article).toMatchObject({
      '@type': 'BlogPosting',
      headline: post.metadata.title,
      datePublished: '2026-11-10',
      dateModified: '2026-11-10',
      inLanguage: 'de',
      url: 'https://kamycoding.com/de/blog/fixture',
      image: 'https://kamycoding.com/de/blog/fixture/og.png',
      keywords: 'next, mdx',
      articleSection: 'Softwareentwicklung',
      author: { '@id': 'https://kamycoding.com/#person' }
    })
  })

  it('adds the breadcrumb trail and a Person with only public facts', () => {
    expect(breadcrumb).toMatchObject({ '@type': 'BreadcrumbList' })
    expect((breadcrumb.itemListElement as { item: string }[]).map(item => item.item)).toEqual([
      'https://kamycoding.com/de',
      'https://kamycoding.com/de/blog',
      'https://kamycoding.com/de/blog/fixture'
    ])
    expect(person).toEqual({
      '@type': 'Person',
      '@id': 'https://kamycoding.com/#person',
      name: 'Kamyar Zamanfar',
      jobTitle: 'Full-Stack Developer',
      url: 'https://kamycoding.com',
      sameAs: ['https://github.com/kamycoding', 'https://www.linkedin.com/in/kamyarzamanfar']
    })
  })

  it('serializes to JSON that cannot close the script element', () => {
    const json = serializeJsonLd(graph)

    expect(json).not.toContain('<')
    expect(JSON.parse(json)).toEqual(graph)
  })
})
