import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { PublishedPost } from './posts'
import type { PostLanguage, PostMetadata } from './schema'

const WORDS_PER_MINUTE = 220

// The MDX source without its metadata export, code blocks, tags and expressions: what a reader reads.
const proseOf = (source: string) =>
  source
    .replace(/^export const metadata = [\s\S]*?^}\n/m, '')
    .replace(/^```[\s\S]*?^```/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')

const wordCount = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0

export const readingMinutes = (source: string) => Math.max(1, Math.ceil(wordCount(proseOf(source)) / WORDS_PER_MINUTE))

// Pages are prerendered, so each file is read once per build; without it the card leaves the reading time out.
const sourceOf = async (slug: string, lang: string) => {
  try {
    return await readFile(path.join(process.cwd(), 'content/posts', slug, `${lang}.mdx`), 'utf8')
  } catch {
    return null
  }
}

// Everything one article card shows, as plain data, so the card itself stays a simple component.
export type ArticleCardData = Readonly<{
  slug: string
  lang: PostLanguage
  title: string
  description: string
  date: string
  category: PostMetadata['category']

  // Every published translation, English first.
  languages: readonly PostLanguage[]
  minutes: number | null
}>

export const articleCards = (all: readonly PublishedPost[], posts: readonly PublishedPost[]) =>
  Promise.all(
    posts.map(async ({ slug, metadata }): Promise<ArticleCardData> => {
      const source = await sourceOf(slug, metadata.lang)
      const translations = all.filter(item => item.slug === slug).map(item => item.metadata.lang)

      return {
        slug,
        lang: metadata.lang,
        title: metadata.title,
        description: metadata.description,
        date: metadata.date,
        category: metadata.category,
        languages: (['en', 'de'] as const).filter(lang => translations.includes(lang)),
        minutes: source ? readingMinutes(source) : null
      }
    })
  )
