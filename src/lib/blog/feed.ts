import { localePath, SITE_URL } from '../site'

import type { PublishedPost } from './posts'
import type { PostLanguage, PostMetadata } from './schema'

type FeedOptions = Readonly<{
  locale: PostLanguage
  title: string
  description: string
  category: (category: PostMetadata['category']) => string
  posts: readonly PublishedPost[]
}>

const escape = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

// RSS wants RFC 822 dates; posts carry calendar days, so midnight UTC stands for the day.
const rfc822 = (day: string) => new Date(`${day}T00:00:00Z`).toUTCString()

/*
 * RSS 2.0 for one language, with only that language's translations. An empty registry gives a valid feed with an
 * empty channel, so the URL works before the first post is published.
 */
export const journalFeed = ({ locale, title, description, category, posts }: FeedOptions) => {
  const url = (path: string) => `${SITE_URL}${localePath(locale, path)}`
  const items = posts.filter(post => post.metadata.lang === locale)

  const newest = items
    .map(post => post.metadata.updated ?? post.metadata.date)
    .sort()
    .at(-1)

  const entries = items.map(({ slug, metadata }) => {
    const link = escape(url(`/blog/${slug}`))

    return [
      '    <item>',
      `      <title>${escape(metadata.title)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      `      <pubDate>${rfc822(metadata.date)}</pubDate>`,
      `      <description>${escape(metadata.description)}</description>`,
      `      <category>${escape(category(metadata.category))}</category>`,
      '    </item>'
    ].join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escape(title)}</title>`,
    `    <link>${escape(url('/blog'))}</link>`,
    `    <description>${escape(description)}</description>`,
    `    <language>${locale}</language>`,
    `    <atom:link href="${escape(url('/blog/rss.xml'))}" rel="self" type="application/rss+xml"/>`,
    ...(newest ? [`    <lastBuildDate>${rfc822(newest)}</lastBuildDate>`] : []),
    ...entries,
    '  </channel>',
    '</rss>',
    ''
  ].join('\n')
}
