import type { Metadata } from 'next'

// The production address. Previews use it too, so search engines always point at kamycoding.com.
export const SITE_URL = 'https://kamycoding.com'
export const SITE_NAME = 'kamycoding'

type SiteLocale = 'en' | 'de'

// English has no prefix, German lives under /de (docs/adr/0004-locale-routing.md).
export const localePath = (locale: SiteLocale, path = '/') => {
  if (locale === 'en') return path

  return path === '/' ? '/de' : `/de${path}`
}

type PageMetadataInput = Readonly<{
  locale: string
  path?: string
  title: string
  description?: string
}>

// Canonical URL, language alternates, Open Graph and Twitter tags for one page in one language.
export const pageMetadata = ({ locale, path = '/', title, description }: PageMetadataInput): Metadata => {
  const current: SiteLocale = locale === 'de' ? 'de' : 'en'

  return {
    title,
    description,
    alternates: {
      canonical: localePath(current, path),
      languages: { en: localePath('en', path), de: localePath('de', path), 'x-default': localePath('en', path) }
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: localePath(current, path),
      title,
      description,
      locale: current === 'de' ? 'de_DE' : 'en_US',
      alternateLocale: current === 'de' ? 'en_US' : 'de_DE'
    },
    twitter: { card: 'summary_large_image', title, description }
  }
}
