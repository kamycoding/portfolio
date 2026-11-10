import { renderToStaticMarkup } from 'react-dom/server'

import { describe, expect, it } from 'vitest'

import { notFoundRoutes } from '@/lib/not-found'

import de from '../../messages/de.json'
import en from '../../messages/en.json'

import NotFoundView from './not-found-view'

const render = (locale: 'en' | 'de') =>
  renderToStaticMarkup(
    <NotFoundView
      copy={locale === 'en' ? en.notFound : de.notFound}
      homeHref={locale === 'en' ? '/' : '/de'}
      journalHref={locale === 'en' ? '/blog' : '/de/blog'}
      candidates={notFoundRoutes(locale, [])}
    />
  )

describe('NotFoundView', () => {
  it('renders the static fallbacks that the browser later fills in with the real path', () => {
    const html = render('en')

    expect(html).toContain('<p lang="en"')
    expect(html).toContain('Module not found: Can&#x27;t resolve this path')
    expect(html).toContain('Try <a href="/">/</a> or <a href="/blog">/blog</a>')
    expect(html).toContain('404.tsx')
  })

  it('keeps the heading and the three actions, and hides the decoration from assistive technology', () => {
    const html = render('de')

    expect(html).toContain('<h1')
    expect(html).toContain('Seite nicht gefunden')
    expect(html).toContain('Versuch&#x27;s mit <a href="/de">/de</a> oder <a href="/de/blog">/de/blog</a>')
    expect(html.match(/<nav[^>]*>.*<\/nav>/)?.[0].match(/<a /g)).toHaveLength(3)
    expect(html).toContain('href="/de#work"')
    expect(html).toContain('Zum Journal')
    expect(html).toMatch(/<div aria-hidden="true" class="[^"]*">.*404\.tsx/)
    expect(html).toMatch(/<svg class="[^"]*"[^>]*aria-hidden="true"/)
  })
})
