import { renderToStaticMarkup } from 'react-dom/server'

import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'

import type { ArticleCardData } from '@/lib/blog/card'

import de from '../../../messages/de.json'
import en from '../../../messages/en.json'

import KeepReading from './keep-reading'

// next-intl's Link needs the App Router; the cards only have to reach it with the right props.
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, lang, children }: { href: string; lang: string; children: string }) => (
    <a href={href} lang={lang}>
      {children}
    </a>
  )
}))

const card = (slug: string, lang: 'en' | 'de'): ArticleCardData => ({
  slug,
  lang,
  title: `Title of ${slug}`,
  description: 'Keep reading fixture.',
  date: '2026-11-10',
  category: 'engineering',
  languages: [lang],
  minutes: 5
})

const render = (locale: 'en' | 'de', cards: ArticleCardData[]) =>
  renderToStaticMarkup(
    <NextIntlClientProvider locale={locale} messages={locale === 'en' ? en : de}>
      <KeepReading cards={cards} />
    </NextIntlClientProvider>
  )

describe('KeepReading', () => {
  it('renders nothing without another post', () => {
    expect(render('en', [])).toBe('')
  })

  it('puts the cards under an h2 that names the section, with h3 titles', () => {
    const html = render('en', [card('one', 'en'), card('two', 'en')])
    const id = /<h2 id="([^"]+)">Keep reading<\/h2>/.exec(html)?.[1]

    expect(id).toBeTruthy()
    expect(html).toContain(`aria-labelledby="${id}"`)
    expect(html.match(/<h3\b/g)).toHaveLength(2)
    expect(html.match(/<h2\b/g)).toHaveLength(1)
  })

  it('uses the German heading and keeps the language label of an English-only post', () => {
    const html = render('de', [card('one', 'en')])

    expect(html).toContain('>Weiterlesen</h2>')
    expect(html).toContain('<span>Verfügbar auf Englisch</span>')
    expect(html).toContain('<a href="/blog/one" hrefLang="en" lang="en"')
  })
})
