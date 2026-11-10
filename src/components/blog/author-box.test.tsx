import { renderToStaticMarkup } from 'react-dom/server'

import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'

import de from '../../../messages/de.json'
import en from '../../../messages/en.json'

import AuthorBox from './author-box'

const render = (locale: 'en' | 'de') =>
  renderToStaticMarkup(
    <NextIntlClientProvider locale={locale} messages={locale === 'en' ? en : de}>
      <AuthorBox />
    </NextIntlClientProvider>
  )

describe('AuthorBox', () => {
  it('shows only the public facts the site already states', () => {
    const html = render('en')

    expect(html).toContain('<footer')
    expect(html).toContain('<address')
    expect(html).toContain('Kamyar Zamanfar')
    expect(html).toContain('Full-stack developer near Cologne.')
    expect(html).toContain('href="https://github.com/kamycoding"')
    expect(html).toContain('href="https://www.linkedin.com/in/kamyarzamanfar"')
    expect(html).not.toMatch(/Heldio|Akademie/)
  })

  it('uses the German wording of the site', () => {
    expect(render('de')).toContain('Full-Stack-Entwickler bei Köln.')
  })
})
