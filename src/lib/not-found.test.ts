import { describe, expect, it } from 'vitest'

import { displayPath, notFoundRoutes, suggestRoute, tabName } from './not-found'

const en = notFoundRoutes('en', ['bilingual-journal'])
const de = notFoundRoutes('de', ['bilingual-journal'])

describe('displayPath', () => {
  it('decodes percent-encoding and keeps malformed input as it is', () => {
    expect(displayPath('/%C3%BCber')).toBe('/über')
    expect(displayPath('/%E0%A4%A')).toBe('/%E0%A4%A')
  })

  it('shows markup only as text and drops control characters', () => {
    expect(displayPath('/%3Cscript%3E')).toBe('/<script>')
    expect(displayPath('/a%0Ab')).toBe('/ab')
  })

  it('shortens very long paths', () => {
    const shown = displayPath(`/${'x'.repeat(300)}`)

    expect(shown).toHaveLength(120)
    expect(shown.endsWith('…')).toBe(true)
  })
})

describe('tabName', () => {
  it.each([
    ['/hello', 'hello.tsx'],
    ['/de/hallo', 'hallo.tsx'],
    ['/blog/unknown-post', 'unknown-post.mdx'],
    ['/de/blog/unbekannt', 'unbekannt.mdx'],
    ['/missing.txt', 'missing.txt'],
    ['/de', 'index.tsx']
  ])('names %s as %s', (path, name) => {
    expect(tabName(path)).toBe(name)
  })
})

describe('suggestRoute', () => {
  it.each([
    ['/blgo', '/blog'],
    ['/blo', '/blog'],
    ['/projects', '/#work'],
    ['/contakt', '/#contact'],
    ['/privacy', '/privacy-policy'],
    ['/legal-notise', '/legal-notice'],
    ['/blog/bilingual-jornal', '/blog/bilingual-journal'],
    ['/blog/something-else', '/blog']
  ])('suggests %s -> %s', (path, href) => {
    expect(suggestRoute(path, en)).toBe(href)
  })

  it('keeps the locale of the 404 in the suggestion', () => {
    expect(suggestRoute('/de/impresum', de)).toBe('/de/legal-notice')
    expect(suggestRoute('/de/projekte', de)).toBe('/de#work')
  })

  it('suggests nothing when no route is close', () => {
    expect(suggestRoute('/hello', en)).toBeNull()
    expect(suggestRoute('/de/hallo', de)).toBeNull()
    expect(suggestRoute('/x', en)).toBeNull()
  })

  it('only ever links routes from the list, never the requested path', () => {
    const suggestion = suggestRoute('/blog%22%3E%3Cscript%3E', en)

    expect([null, ...en.map(route => route.href)]).toContain(suggestion)
  })
})
