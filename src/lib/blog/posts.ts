import type { ComponentType } from 'react'

import type { MDXProps } from 'mdx/types'

import { type Learning, learningSchemas } from './learning'
import {
  outlineSchema,
  postLanguageSchema,
  postMetadataSchema,
  postSlugSchema,
  type OutlineItem,
  type PostLanguage,
  type PostMetadata
} from './schema'

// @types/mdx only declares the default export; listPosts validates the named exports at runtime.
type PostModule = Readonly<{
  default: ComponentType<MDXProps>
  metadata?: unknown
  outline?: unknown
}>

export type PostRegistration = Readonly<{
  slug: string
  lang: PostLanguage
  load: () => Promise<PostModule>
  learning?: () => Promise<{ default: unknown }>
}>

export type PublishedPost = Readonly<{
  slug: string
  metadata: PostMetadata
  outline: OutlineItem[]
  learning: Learning | null
  Content: PostModule['default']
}>

// Register explicit imports from content/posts/ here, with the slug's learning.json if it has one. Never import
// content/drafts/.
const POSTS: readonly PostRegistration[] = []

// Parsed per translation, so the reader-facing text resolves to that translation's language.
const parseLearning = async (entry: PostRegistration, load: NonNullable<PostRegistration['learning']>) => {
  const result = learningSchemas[entry.lang].safeParse((await load()).default)

  if (!result.success) {
    throw new Error(`Invalid learning.json for ${entry.slug}/${entry.lang}.mdx: ${result.error.message}`, {
      cause: result.error
    })
  }

  return result.data
}

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

      const outline = outlineSchema.safeParse(postModule.outline)

      if (!outline.success) {
        throw new Error(`Invalid outline for ${entry.slug}/${entry.lang}.mdx: ${outline.error.message}`, {
          cause: outline.error
        })
      }

      const learning = entry.learning ? await parseLearning(entry, entry.learning) : null

      return { slug: entry.slug, metadata: result.data, outline: outline.data, learning, Content: postModule.default }
    })
  )

  return posts.sort(
    (a, b) =>
      b.metadata.date.localeCompare(a.metadata.date) ||
      a.slug.localeCompare(b.slug) ||
      a.metadata.lang.localeCompare(b.metadata.lang)
  )
}
