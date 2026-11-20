import type { PublishedPost } from './posts'
import { journalIndexPosts } from './routes'
import type { PostLanguage } from './schema'

// The homepage shows the newest posts as cards; the index has the rest.
export const HOME_POSTS = 3

// What the terminal and the command palette need to list and open a post.
export type PostEntry = Readonly<{ slug: string; title: string; lang: PostLanguage }>

export const homePosts = (posts: readonly PublishedPost[], locale: PostLanguage) =>
  journalIndexPosts(posts, locale).slice(0, HOME_POSTS)

export const postEntries = (posts: readonly PublishedPost[], locale: PostLanguage): PostEntry[] =>
  journalIndexPosts(posts, locale).map(({ slug, metadata }) => ({ slug, title: metadata.title, lang: metadata.lang }))
