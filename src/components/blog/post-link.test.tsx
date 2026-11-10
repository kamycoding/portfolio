import { renderToStaticMarkup } from 'react-dom/server'

import { NextIntlClientProvider } from 'next-intl'
import { afterEach, describe, expect, it, vi } from 'vitest'

import PostLink, { setLocaleCookie } from './post-link'

// next-intl's Link needs the App Router; the same-language branch only has to reach it with the right props.
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, lang, children }: { href: string; lang: string; children: string }) => (
    <a data-intl='' href={href} lang={lang}>
      {children}
    </a>
  )
}))

const render = (locale: 'en' | 'de', language: 'en' | 'de') =>
  renderToStaticMarkup(
    <NextIntlClientProvider locale={locale} messages={{}}>
      <PostLink slug='fixture' language={language}>
        Title
      </PostLink>
    </NextIntlClientProvider>
  )

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PostLink', () => {
  it('links a German-only post from the English index directly to /de', () => {
    expect(render('en', 'de')).toBe('<a href="/de/blog/fixture" hrefLang="de" lang="de">Title</a>')
  })

  it('links an English-only post from the German index without /en', () => {
    expect(render('de', 'en')).toBe('<a href="/blog/fixture" hrefLang="en" lang="en">Title</a>')
  })

  it('uses the locale-aware link for posts in the current language', () => {
    expect(render('de', 'de')).toBe('<a data-intl="" href="/blog/fixture" lang="de">Title</a>')
  })

  it('sets the locale cookie with the proxy flags', () => {
    const document = { cookie: '' }

    vi.stubGlobal('document', document)
    setLocaleCookie('en')

    expect(document.cookie).toBe('NEXT_LOCALE=en; path=/; SameSite=Lax; Secure')
  })
})
