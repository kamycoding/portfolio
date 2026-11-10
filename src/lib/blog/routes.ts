import type { PublishedPost } from './posts'
import type { PostLanguage } from './schema'

export const withoutLocalePrefix = (pathname: string) => pathname.replace(/^\/(?:en|de)(?=\/|$)/, '') || '/'

export const isJournalRoute = (pathname: string) => /^\/blog(?:\/|$)/.test(withoutLocalePrefix(pathname))

export const journalFile = (pathname: string, locale: PostLanguage) =>
  withoutLocalePrefix(pathname).replace(/\/$/, '') === '/blog' ? 'blog/' : `${locale}.mdx`

export const journalStaticParams = (posts: readonly PublishedPost[]) =>
  [...new Set(posts.map(post => post.slug))].map(slug => ({ slug }))

export type PostRoute =
  | Readonly<{ kind: 'unknown' }>
  | Readonly<{ kind: 'post'; post: PublishedPost; languages: PostLanguage[] }>
  | Readonly<{ kind: 'missing'; available: PublishedPost }>

export const resolvePostRoute = (posts: readonly PublishedPost[], slug: string, locale: PostLanguage): PostRoute => {
  const translations = posts.filter(post => post.slug === slug)

  if (!translations.length) return { kind: 'unknown' }

  const post = translations.find(item => item.metadata.lang === locale)

  if (post) return { kind: 'post', post, languages: translations.map(item => item.metadata.lang) }

  return { kind: 'missing', available: translations.find(item => item.metadata.lang === 'en') ?? translations[0] }
}

export const journalIndexPosts = (posts: readonly PublishedPost[], locale: PostLanguage) =>
  journalStaticParams(posts)
    .map(({ slug }) => {
      const route = resolvePostRoute(posts, slug, locale)

      return route.kind === 'post' ? route.post : route.kind === 'missing' ? route.available : undefined
    })
    .filter((post): post is PublishedPost => post !== undefined)
    .sort((a, b) => b.metadata.date.localeCompare(a.metadata.date) || a.slug.localeCompare(b.slug))
