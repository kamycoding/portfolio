import type { PublishedPost } from './posts'
import { journalIndexPosts } from './routes'
import type { PostLanguage } from './schema'

export const RELATED_POSTS = 2

/*
 * "Keep reading" at the end of an article: the other posts, newest first, never the current one. Posts in the page
 * language come first; one that exists only in the other language fills a free place.
 */
export const relatedPosts = (posts: readonly PublishedPost[], slug: string, locale: PostLanguage) => {
  const others = journalIndexPosts(posts, locale).filter(post => post.slug !== slug)

  return [
    ...others.filter(post => post.metadata.lang === locale),
    ...others.filter(post => post.metadata.lang !== locale)
  ].slice(0, RELATED_POSTS)
}
