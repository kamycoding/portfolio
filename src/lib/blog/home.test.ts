import { describe, expect, it } from 'vitest'

import { HOME_POSTS, homePosts, postEntries } from './home'
import type { PublishedPost } from './posts'
import type { PostLanguage } from './schema'

const post = (slug: string, lang: PostLanguage, date: string): PublishedPost => ({
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
  }
})

describe('homePosts', () => {
  it('is empty while nothing is published, which hides the section', () => {
    expect(homePosts([], 'en')).toEqual([])
  })

  it('keeps one entry per slug in the best language, newest first', () => {
    const posts = [
      post('a', 'en', '2026-11-01'),
      post('b', 'en', '2026-11-04'),
      post('b', 'de', '2026-11-04'),
      post('c', 'en', '2026-11-03')
    ]

    expect(homePosts(posts, 'de').map(item => `${item.slug}/${item.metadata.lang}`)).toEqual(['b/de', 'c/en', 'a/en'])
  })

  it('shows only the newest three', () => {
    const posts = ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04'].map((date, index) =>
      post(`p${index}`, 'en', date)
    )

    expect(HOME_POSTS).toBe(3)
    expect(homePosts(posts, 'en').map(item => item.slug)).toEqual(['p3', 'p2', 'p1'])
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
