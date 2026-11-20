import { renderToStaticMarkup } from 'react-dom/server'

import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'

import type { ArticleCardData } from '@/lib/blog/card'

import de from '../../../messages/de.json'
import en from '../../../messages/en.json'

import ArticleCard from './article-card'

// next-intl's Link needs the App Router; the card only has to reach it with the right props.
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, lang, children }: { href: string; lang: string; children: string }) => (
    <a href={href} lang={lang}>
      {children}
    </a>
  )
}))

const card: ArticleCardData = {
  slug: 'fixture',
  lang: 'en',
  title: 'The JavaScript Event Loop: Predict the Output',
  description: 'Guess what this code logs, then step through the call stack and queues.',
  date: '2026-11-10',
  category: 'engineering',
  languages: ['en', 'de'],
  minutes: 9
}

const render = (locale: 'en' | 'de', data: ArticleCardData = card, headingLevel: 2 | 3 = 3) =>
  renderToStaticMarkup(
    <NextIntlClientProvider locale={locale} messages={locale === 'en' ? en : de}>
      <ArticleCard card={data} headingLevel={headingLevel} />
    </NextIntlClientProvider>
  )

// Two text fragments in this order, with nothing but tags between them.
const inOrder = (first: string, second: string) => new RegExp(`${first}(?:<[^>]+>)*${second}`)

describe('ArticleCard', () => {
  it('renders an article with one link, whose text is the title', () => {
    const html = render('en')
    const links = [...html.matchAll(/<a\b[^>]*>(.*?)<\/a>/g)]

    expect(html).toMatch(/^<article\b/)
    expect(links).toHaveLength(1)
    expect(links[0][1]).toBe(card.title)
    expect(links[0][0]).toContain('href="/blog/fixture"')
  })

  it('takes the heading level from its prop', () => {
    expect(render('en', card, 3)).toMatch(/<h3 [^>]*><a [^>]*>The JavaScript Event Loop/)
    expect(render('en', card, 2)).toMatch(/<h2 [^>]*><a [^>]*>The JavaScript Event Loop/)
    expect(render('en', card, 2)).not.toContain('<h3')
  })

  it('shows category, languages, a localized date and the reading time in English', () => {
    const html = render('en')

    expect(html).toMatch(inOrder('Engineering', 'English, German'))
    expect(html).toContain('<time dateTime="2026-11-10">10 Nov 2026</time>')
    expect(html).toContain('<span>9 min read</span>')
  })

  it('uses German wording and dates on German pages', () => {
    const html = render('de')

    expect(html).toMatch(inOrder('Softwareentwicklung', 'Englisch, Deutsch'))
    expect(html).toContain('<time dateTime="2026-11-10">10. Nov. 2026</time>')
    expect(html).toContain('<span>9 Min. Lesezeit</span>')
  })

  it('shows "Read article" to sighted readers only, so screen readers hear one link', () => {
    expect(render('en')).toMatch(/<span aria-hidden="true"[^>]*>Read article →<\/span>/)
    expect(render('de')).toMatch(/<span aria-hidden="true"[^>]*>Artikel lesen →<\/span>/)
  })

  it('says when a post exists only in the other language and links it there', () => {
    const html = render('de', { ...card, languages: ['en'] })

    expect(html).toContain('<span>Verfügbar auf Englisch</span>')
    expect(html).toContain('<a href="/blog/fixture" hrefLang="en" lang="en"')
  })

  it('marks the heading with the post language only when it differs from the page', () => {
    expect(render('de', { ...card, languages: ['en'] })).toMatch(/<h3 lang="en" class="[^"]*"><a /)
    expect(render('en')).toMatch(/<h3 class="[^"]*"><a /)
  })

  it('keeps the full description in the DOM and leaves an unknown reading time out', () => {
    const html = render('en', { ...card, minutes: null })

    expect(html).toMatch(new RegExp(`<p lang="en" class="[^"]*description[^"]*">${card.description}</p>`))
    expect(html).not.toContain('min read')
  })
})
