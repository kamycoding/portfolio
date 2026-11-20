import type { Metadata, MetadataRoute } from 'next'

// The production address. Previews use it too, so search engines always point at kamycoding.com.
export const SITE_URL = 'https://kamycoding.com'
export const SITE_NAME = 'kamycoding'
export const AUTHOR_NAME = 'Kamyar Zamanfar'
export const HOME_IMAGE_ALT = 'Kamyar Zamanfar, kamycoding.com'
export const EMAIL = 'contact@kamycoding.com'

// Public profiles, as the footer and the contact section link them.
export const PROFILES = {
  github: 'https://github.com/kamycoding',
  linkedin: 'https://www.linkedin.com/in/kamyarzamanfar'
} as const

type SiteLocale = 'en' | 'de'

// English has no prefix, German lives under /de (docs/adr/0004-locale-routing.md).
export const localePath = (locale: SiteLocale, path = '/') => {
  if (locale === 'en') return path

  return path === '/' ? '/de' : `/de${path}`
}

// Search results cut titles after about 60 characters, so the site name is only added while it still fits.
export const TITLE_LIMIT = 60

export const documentTitle = (title: string) => {
  const full = `${title} | ${SITE_NAME}`

  return full.length <= TITLE_LIMIT ? full : title
}

// Both homepages for the sitemap, with the same language alternates as their HTML (x-default is English).
export const homeSitemap = (): MetadataRoute.Sitemap => {
  const url = (locale: SiteLocale) => `${SITE_URL}${localePath(locale)}`

  return (['en', 'de'] as const).map(locale => ({
    url: url(locale),
    alternates: { languages: { en: url('en'), de: url('de'), 'x-default': url('en') } }
  }))
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
