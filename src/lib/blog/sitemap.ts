import type { MetadataRoute } from 'next'

import { localePath, SITE_URL } from '../site'

import type { PublishedPost } from './posts'
import { journalIndexPosts } from './routes'
import type { PostLanguage } from './schema'

const LOCALES: readonly PostLanguage[] = ['en', 'de']

const absolute = (locale: PostLanguage, path: string) => `${SITE_URL}${localePath(locale, path)}`
const lastChange = (post: PublishedPost) => post.metadata.updated ?? post.metadata.date

/*
 * Only indexable journal URLs: both indexes once a post exists (the same condition as their robots tag) and every
 * published translation. Notices for missing translations are noindex and never listed.
 */
export const journalSitemap = (posts: readonly PublishedPost[]): MetadataRoute.Sitemap => {
  if (posts.length === 0) return []

  const indexes = LOCALES.map(locale => ({
    url: absolute(locale, '/blog'),
    lastModified: journalIndexPosts(posts, locale).map(lastChange).sort().at(-1),
    alternates: { languages: { en: absolute('en', '/blog'), de: absolute('de', '/blog') } }
  }))

  const articles = posts.map(post => {
    const path = `/blog/${post.slug}`
    const translations = posts.filter(other => other.slug === post.slug).map(other => other.metadata.lang)
    const fallback = translations.includes('en') ? 'en' : translations[0]
    const languages = Object.fromEntries(translations.map(language => [language, absolute(language, path)]))

    return {
      url: absolute(post.metadata.lang, path),
      lastModified: lastChange(post),
      alternates: { languages: { ...languages, 'x-default': absolute(fallback, path) } }
    }
  })

  return [...indexes, ...articles]
}
