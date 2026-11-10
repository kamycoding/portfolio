import { describe, expect, it } from 'vitest'

import { clipHash, clipPath } from './audio'
import { audioConfig } from './audio-config'
import { HOME_POSTS, homePosts, outlineHeadings, postContrast, postEntries, postStats, readingMinutes } from './home'
import type { PublishedPost } from './posts'
import type { PostLanguage } from './schema'

const post = (slug: string, lang: PostLanguage, date: string, extra: Partial<PublishedPost> = {}): PublishedPost => ({
  slug,
  Content: () => null,
  outline: [],
  learning: null,
  audio: null,
  metadata: {
    title: `Title of ${slug}`,
    description: 'Home fixture.',
    date,
    category: 'learning',
    format: 'note',
    tags: [],
    draft: false,
    lang
  },
  ...extra
})

const learning = {
  terms: { stuck: { de: 'Da häng ich grad ein bisschen.', en: "I'm a bit stuck there." } },
  contrast: { textbook: 'Ich habe ein Problem.', term: 'stuck' }
}

describe('homePosts', () => {
  it('is empty while nothing is published, which hides the section', () => {
    expect(homePosts([], 'en')).toEqual([])
  })

  it('keeps the newest posts, one entry per slug in the best language', () => {
    const posts = [
      post('a', 'en', '2026-11-01'),
      post('b', 'en', '2026-11-04'),
      post('b', 'de', '2026-11-04'),
      post('c', 'en', '2026-11-03'),
      post('d', 'de', '2026-11-02')
    ]

    expect(homePosts(posts, 'de').map(item => `${item.slug}/${item.metadata.lang}`)).toEqual(['b/de', 'c/en', 'd/de'])
    expect(homePosts(posts, 'de')).toHaveLength(HOME_POSTS)
  })
})

describe('postEntries', () => {
  it('lists every post with the language it opens in', () => {
    const posts = [post('a', 'en', '2026-11-01'), post('b', 'de', '2026-11-02')]

    expect(postEntries(posts, 'en')).toEqual([
      { slug: 'b', title: 'Title of b', lang: 'de' },
      { slug: 'a', title: 'Title of a', lang: 'en' }
    ])
  })
})

describe('postContrast', () => {
  it('is null without a contrast in learning.json', () => {
    expect(postContrast(post('a', 'en', '2026-11-01'))).toBeNull()
    expect(postContrast(post('a', 'en', '2026-11-01', { learning: { terms: learning.terms } }))).toBeNull()
  })

  it('pairs the textbook line with the term and offers no file before the clip exists', () => {
    expect(postContrast(post('a', 'en', '2026-11-01', { learning }))).toEqual({
      textbook: 'Ich habe ein Problem.',
      real: 'Da häng ich grad ein bisschen.',
      meaning: "I'm a bit stuck there.",
      audio: { src: undefined, text: 'Da häng ich grad ein bisschen.' }
    })
  })

  it('plays the clip the article plays once audio.json lists it', () => {
    const hash = clipHash(learning.terms.stuck.de, audioConfig.voices.narrator, audioConfig)
    const clips = { [hash]: { text: learning.terms.stuck.de, model: 'model', voice: 'voice' } }
    const contrast = postContrast(post('a', 'en', '2026-11-01', { learning, audio: { version: 1, clips } }))

    expect(contrast?.audio.src).toBe(clipPath('a', hash))
  })
})

describe('readingMinutes', () => {
  it('counts prose only and rounds up', () => {
    const body = Array.from({ length: 300 }, () => 'word').join(' ')
    const source = `export const metadata = {\n  title: 'ignored words here'\n}\n\n<Callout>${body}</Callout>\n\n\`\`\`js\nconst ignored = 1\n\`\`\`\n`

    expect(readingMinutes(source)).toBe(2)
    expect(readingMinutes('short')).toBe(1)
  })
})

describe('outlineHeadings', () => {
  it('keeps the h2 headings only', () => {
    const outline = [
      { id: 'a', text: 'A', depth: 2 },
      { id: 'b', text: 'B', depth: 3 }
    ] as const

    expect(outlineHeadings(outline)).toEqual([{ id: 'a', text: 'A' }])
  })
})

describe('postStats', () => {
  it('counts terms and the clips that audio.json lists, and nothing else', () => {
    const hash = clipHash(learning.terms.stuck.de, audioConfig.voices.narrator, audioConfig)
    const clips = { [hash]: { text: learning.terms.stuck.de, model: 'model', voice: 'voice' } }

    expect(postStats(post('a', 'en', '2026-11-01', { learning, audio: { version: 1, clips } }), 4)).toEqual({
      minutes: 4,
      terms: 1,
      clips: 1
    })
    expect(postStats(post('a', 'en', '2026-11-01', { learning }), null)).toEqual({ minutes: null, terms: 1, clips: 0 })
    expect(postStats(post('a', 'en', '2026-11-01'), 1)).toEqual({ minutes: 1, terms: 0, clips: 0 })
  })
})
