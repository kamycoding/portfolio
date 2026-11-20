import { existsSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { homeGraph, PERSON_ID, personNode, WEBSITE_ID } from './structured-data'

const author = {
  jobTitle: 'Full-Stack Developer',
  description: 'Full-stack developer near Cologne. TypeScript, React, Next.js and Node. Co-founder of Heldio.'
}

type Node = Record<string, unknown>

const nodes = (locale: 'en' | 'de') => homeGraph({ locale, ...author })['@graph'] as Node[]
const byType = (graph: Node[], type: string) => graph.find(node => node['@type'] === type)!

// Every value, however deep, so a missing or empty fact cannot hide inside a nested object.
const leaves = (value: unknown): unknown[] =>
  typeof value === 'object' && value !== null ? Object.values(value).flatMap(leaves) : [value]

describe('personNode', () => {
  it('states only the public facts of the site', () => {
    expect(personNode(author)).toEqual({
      '@type': 'Person',
      '@id': 'https://kamycoding.com/#person',
      name: 'Kamyar Zamanfar',
      url: 'https://kamycoding.com',
      jobTitle: 'Full-Stack Developer',
      description: author.description,
      image: 'https://kamycoding.com/portrait.webp',
      email: 'contact@kamycoding.com',
      sameAs: ['https://github.com/kamycoding', 'https://www.linkedin.com/in/kamyarzamanfar'],
      knowsAbout: ['TypeScript', 'React', 'Next.js', 'Node.js', 'web development'],
      address: { '@type': 'PostalAddress', addressRegion: 'North Rhine-Westphalia', addressCountry: 'DE' }
    })
  })

  it('names a portrait that exists in public/', () => {
    const file = new URL(personNode(author).image).pathname

    expect(existsSync(path.join(process.cwd(), 'public', file))).toBe(true)
  })
})

describe('homeGraph', () => {
  it.each([
    ['en', 'https://kamycoding.com/'],
    ['de', 'https://kamycoding.com/de']
  ] as const)('describes the %s homepage as a ProfilePage about the Person', (locale, url) => {
    const graph = nodes(locale)

    expect(graph.map(node => node['@type'])).toEqual(['ProfilePage', 'Person', 'WebSite'])
    expect(byType(graph, 'ProfilePage')).toEqual({
      '@type': 'ProfilePage',
      '@id': `${url}#profilepage`,
      url,
      inLanguage: locale,
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: { '@id': PERSON_ID }
    })
  })

  it('describes one website in both languages, published by the Person', () => {
    expect(byType(nodes('de'), 'WebSite')).toEqual({
      '@type': 'WebSite',
      '@id': 'https://kamycoding.com/#website',
      name: 'kamycoding',
      url: 'https://kamycoding.com',
      inLanguage: ['en', 'de'],
      publisher: { '@id': PERSON_ID }
    })
  })

  it('uses the shared Person, so both languages point at one entity', () => {
    expect(byType(nodes('en'), 'Person')).toEqual(personNode(author))
    expect(byType(nodes('de'), 'Person')['@id']).toBe(byType(nodes('en'), 'Person')['@id'])
  })

  it('resolves every reference inside the graph and leaves no field empty', () => {
    const graph = nodes('en')
    const ids = new Set(graph.map(node => node['@id']))

    const references = graph
      .flatMap(node => Object.values(node))
      .filter((value): value is { '@id': string } => typeof value === 'object' && value !== null && '@id' in value)

    expect(references.length).toBeGreaterThan(0)

    for (const reference of references) expect(ids).toContain(reference['@id'])

    for (const leaf of leaves(graph)) expect(leaf).toEqual(expect.stringMatching(/\S/))
  })
})
