import type { Metadata } from 'next'

import { localePath, pageMetadata } from '../site'

import type { PostRoute } from './routes'
import type { PostLanguage } from './schema'

export const journalIndexMetadata = (
  locale: PostLanguage,
  title: string,
  description: string,
  hasPosts: boolean
): Metadata => ({
  ...pageMetadata({ locale, path: '/blog', title, description }),
  robots: { index: hasPosts, follow: true }
})

export const journalPostMetadata = (
  locale: PostLanguage,
  slug: string,
  route: Exclude<PostRoute, { kind: 'unknown' }>,
  notice: Readonly<{ title: string; description: string }>
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

  const fallback = route.languages.includes('en') ? 'en' : route.languages[0]
  const languages = Object.fromEntries(route.languages.map(language => [language, localePath(language, path)]))

  const metadata = pageMetadata({
    locale,
    path,
    title: route.post.metadata.title,
    description: route.post.metadata.description
  })

  return {
    ...metadata,
    alternates: {
      canonical: localePath(locale, path),
      languages: { ...languages, 'x-default': localePath(fallback, path) }
    },
    openGraph: {
      ...metadata.openGraph,
      alternateLocale: route.languages
        .filter(language => language !== locale)
        .map(language => (language === 'de' ? 'de_DE' : 'en_US'))
    },
    robots: { index: true, follow: true }
  }
}
