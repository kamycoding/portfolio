import type { Metadata } from 'next'

import { HOME_IMAGE_ALT, localePath, pageMetadata, SITE_NAME, SITE_URL } from '../site'

import type { PostRoute } from './routes'
import type { PostLanguage } from './schema'

// The article's own Open Graph image (app/[locale]/blog/[slug]/og.png), also used for Twitter and JSON-LD.
export const articleImagePath = (locale: PostLanguage, slug: string) => `/${locale}/blog/${slug}/og.png`

// The indexes' own Open Graph would drop the inherited homepage image (app/[locale]/opengraph-image.tsx), so they name it.
const homeImage = (locale: PostLanguage) => ({
  url: `/${locale}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: HOME_IMAGE_ALT,
  type: 'image/png'
})

// RSS autodiscovery: each journal page points to the feed of its own language.
const feedLink = (locale: PostLanguage, title: string) => ({
  'application/rss+xml': [{ url: localePath(locale, '/blog/rss.xml'), title }]
})

export const journalIndexMetadata = (
  locale: PostLanguage,
  title: string,
  description: string,
  hasPosts: boolean
): Metadata => {
  const metadata = pageMetadata({ locale, path: '/blog', title, description })

  const image = homeImage(locale)

  return {
    ...metadata,
    alternates: { ...metadata.alternates, types: feedLink(locale, title) },
    openGraph: { ...metadata.openGraph, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    robots: { index: hasPosts, follow: true }
  }
}

export const journalPostMetadata = (
  locale: PostLanguage,
  slug: string,
  route: Exclude<PostRoute, { kind: 'unknown' }>,
  notice: Readonly<{ title: string; description: string }>,
  feedTitle: string
): Metadata => {
  const path = `/blog/${slug}`

  if (route.kind === 'missing') {
    return {
      ...pageMetadata({ locale, path, title: notice.title, description: notice.description }),
      alternates: { canonical: localePath(route.available.metadata.lang, path), languages: {} },
      robots: { index: false, follow: true },
      openGraph: null,
      twitter: null
    }
  }

  const { title, description, date, updated, tags } = route.post.metadata
  const fallback = route.languages.includes('en') ? 'en' : route.languages[0]
  const languages = Object.fromEntries(route.languages.map(language => [language, localePath(language, path)]))
  const metadata = pageMetadata({ locale, path, title, description })
  const image = { url: articleImagePath(locale, slug), width: 1200, height: 630, alt: title, type: 'image/png' }

  // The browser title carries the site name like the index; social cards show the article title alone.
  return {
    ...metadata,
    title: `${title} | ${SITE_NAME}`,
    alternates: {
      canonical: localePath(locale, path),
      languages: { ...languages, 'x-default': localePath(fallback, path) },
      types: feedLink(locale, feedTitle)
    },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      url: localePath(locale, path),
      title,
      description,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      alternateLocale: route.languages
        .filter(language => language !== locale)
        .map(language => (language === 'de' ? 'de_DE' : 'en_US')),
      publishedTime: date,
      modifiedTime: updated ?? date,
      authors: [SITE_URL],
      tags,
      images: [image]
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    robots: { index: true, follow: true }
  }
}
