import { describe, expect, it } from 'vitest'

import type { PublishedPost } from './posts'
import { RELATED_POSTS, relatedPosts } from './related'
import type { PostLanguage } from './schema'

const post = (slug: string, lang: PostLanguage, date: string): PublishedPost => ({
  slug,
  Content: () => null,
  outline: [],
  learning: null,
  audio: null,
  metadata: {
    title: `Title of ${slug}`,
    description: 'Related fixture.',
    date,
    category: 'learning',
    format: 'note',
    tags: [],
    draft: false,
    lang
  }
})

const names = (posts: readonly PublishedPost[]) => posts.map(item => `${item.slug}/${item.metadata.lang}`)

describe('relatedPosts', () => {
  it('is empty when the current post is the only one, in any language', () => {
    expect(relatedPosts([], 'a', 'en')).toEqual([])
    expect(relatedPosts([post('a', 'en', '2026-11-01'), post('a', 'de', '2026-11-01')], 'a', 'de')).toEqual([])
  })

  it('never lists the current post and shows the newest others first', () => {
    const posts = [post('a', 'en', '2026-11-01'), post('b', 'en', '2026-11-03'), post('c', 'en', '2026-11-02')]

    expect(names(relatedPosts(posts, 'b', 'en'))).toEqual(['c/en', 'a/en'])
    expect(names(relatedPosts(posts, 'a', 'en'))).toEqual(['b/en', 'c/en'])
  })

  it('shows at most two posts', () => {
    const posts = ['a', 'b', 'c', 'd', 'e'].map((slug, index) => post(slug, 'en', `2026-11-0${index + 1}`))

    expect(RELATED_POSTS).toBe(2)
    expect(names(relatedPosts(posts, 'a', 'en'))).toEqual(['e/en', 'd/en'])
  })

  it('links each post in the page language when that translation exists', () => {
    const posts = [post('a', 'en', '2026-11-01'), post('b', 'en', '2026-11-02'), post('b', 'de', '2026-11-02')]

    expect(names(relatedPosts(posts, 'a', 'de'))).toEqual(['b/de'])
    expect(names(relatedPosts(posts, 'a', 'en'))).toEqual(['b/en'])
  })

  it('prefers posts in the page language over newer posts in the other language', () => {
    const posts = [
      post('a', 'de', '2026-11-01'),
      post('b', 'de', '2026-11-02'),
      post('c', 'en', '2026-11-05'),
      post('d', 'de', '2026-11-03'),
      post('e', 'en', '2026-11-06')
    ]

    expect(names(relatedPosts(posts, 'a', 'de'))).toEqual(['d/de', 'b/de'])
  })

  it('fills a free place with a post that exists only in the other language', () => {
    const posts = [post('a', 'de', '2026-11-01'), post('b', 'de', '2026-11-02'), post('c', 'en', '2026-11-05')]

    expect(names(relatedPosts(posts, 'a', 'de'))).toEqual(['b/de', 'c/en'])
    expect(names(relatedPosts(posts, 'b', 'de'))).toEqual(['a/de', 'c/en'])
  })
})
