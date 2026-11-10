import type { ComponentType } from 'react'

import type { MDXProps } from 'mdx/types'

import { postLanguageSchema, postMetadataSchema, postSlugSchema, type PostLanguage, type PostMetadata } from './schema'

type PostModule = Readonly<{
  default: ComponentType<MDXProps>
  metadata: unknown
}>

export type PostRegistration = Readonly<{
  slug: string
  lang: PostLanguage
  load: () => Promise<PostModule>
}>

export type PublishedPost = Readonly<{
  slug: string
  metadata: PostMetadata
  Content: PostModule['default']
}>

// Register explicit imports from content/posts/ here. Never import content/drafts/.
const POSTS: readonly PostRegistration[] = []

// Pages and static route generation use the same validation, so invalid metadata fails the build.
export const listPosts = async (registry: readonly PostRegistration[] = POSTS): Promise<PublishedPost[]> => {
  const seen = new Set<string>()

  for (const entry of registry) {
    postSlugSchema.parse(entry.slug)
    postLanguageSchema.parse(entry.lang)

    const identity = `${entry.slug}/${entry.lang}`

    if (seen.has(identity)) throw new Error(`Duplicate published translation: ${identity}.`)

    seen.add(identity)
  }

  const posts = await Promise.all(
    registry.map(async entry => {
      const postModule = await entry.load()
      const result = postMetadataSchema.safeParse(postModule.metadata)

      if (!result.success) {
        throw new Error(`Invalid metadata for ${entry.slug}/${entry.lang}.mdx: ${result.error.message}`, {
          cause: result.error
        })
      }

      if (result.data.lang !== entry.lang) {
        throw new Error(`Language does not match the registered translation: ${entry.slug}/${entry.lang}.mdx.`)
      }

      return { slug: entry.slug, metadata: result.data, Content: postModule.default }
    })
  )

  return posts.sort(
    (a, b) =>
      b.metadata.date.localeCompare(a.metadata.date) ||
      a.slug.localeCompare(b.slug) ||
      a.metadata.lang.localeCompare(b.metadata.lang)
  )
}
