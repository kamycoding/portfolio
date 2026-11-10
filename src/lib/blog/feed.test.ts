import { describe, expect, it } from 'vitest'

import { journalFeed } from './feed'
import type { PublishedPost } from './posts'
import type { PostLanguage } from './schema'

const post = (slug: string, lang: PostLanguage, date: string, title = 'Title'): PublishedPost => ({
  slug,
  Content: () => null,
  outline: [],
  learning: null,
  audio: null,
  metadata: {
    title,
    description: 'Description with <markup> & "quotes".',
    date,
    category: 'engineering',
    format: 'note',
    tags: [],
    draft: false,
    lang
  }
})

const feed = (locale: PostLanguage, posts: PublishedPost[]) =>
  journalFeed({ locale, title: 'Journal | kamycoding', description: 'Journal', category: c => `Cat ${c}`, posts })

describe('journalFeed', () => {
  it('is a valid RSS channel without items while nothing is published', () => {
    const xml = feed('de', [])

    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<rss version="2.0"/)
    expect(xml).toContain('<link>https://kamycoding.com/de/blog</link>')
    expect(xml).toContain(
      '<atom:link href="https://kamycoding.com/de/blog/rss.xml" rel="self" type="application/rss+xml"/>'
    )
    expect(xml).toContain('<language>de</language>')
    expect(xml).not.toContain('<item>')
    expect(xml).not.toContain('lastBuildDate')
  })

  it('lists only translations in the feed language, with RFC 822 dates and escaped text', () => {
    const xml = feed('en', [post('one', 'en', '2026-11-10', 'Tom & Jerry'), post('two', 'de', '2026-11-11')])

    expect(xml.match(/<item>/g)).toHaveLength(1)
    expect(xml).toContain('<title>Tom &amp; Jerry</title>')
    expect(xml).toContain('<guid isPermaLink="true">https://kamycoding.com/blog/one</guid>')
    expect(xml).toContain('<pubDate>Tue, 10 Nov 2026 00:00:00 GMT</pubDate>')
    expect(xml).toContain('<description>Description with &lt;markup&gt; &amp; &quot;quotes&quot;.</description>')
    expect(xml).toContain('<category>Cat engineering</category>')
    expect(xml).toContain('<lastBuildDate>Tue, 10 Nov 2026 00:00:00 GMT</lastBuildDate>')
  })

  it('uses the newest update for lastBuildDate', () => {
    const updated = post('one', 'en', '2026-11-01')
    const newer = { ...updated, metadata: { ...updated.metadata, updated: '2026-11-20' } }

    expect(feed('en', [newer])).toContain('<lastBuildDate>Fri, 20 Nov 2026 00:00:00 GMT</lastBuildDate>')
  })
})
