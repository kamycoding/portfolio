import { audioItems, clipHash, clipPath, narrationItems } from './audio'
import { audioConfig } from './audio-config'
import type { PublishedPost } from './posts'
import { journalIndexPosts } from './routes'
import type { OutlineItem, PostLanguage } from './schema'

// The homepage shows the newest post in full and at most two more as links.
export const HOME_POSTS = 3

export type PostContrast = Readonly<{
  textbook: string
  real: string
  meaning: string
  audio: Readonly<{ src?: string; text: string }>
}>

// What the terminal and the command palette need to list and open a post.
export type PostEntry = Readonly<{ slug: string; title: string; lang: PostLanguage }>

/*
 * The diff card: the textbook line from learning.json next to the term people really say. The term supplies the
 * audio, so the clip is the one the article plays, and it is only offered when audio.json lists it (docs/adr/0007).
 */
export const postContrast = ({ slug, learning, audio }: PublishedPost): PostContrast | null => {
  const term = learning?.contrast && learning.terms?.[learning.contrast.term]

  if (!term) return null

  const hash = clipHash(term.de, audioConfig.voices.narrator, audioConfig)

  return {
    textbook: learning.contrast!.textbook,
    real: term.de,
    meaning: term.en,
    audio: { src: audio?.clips[hash] ? clipPath(slug, hash) : undefined, text: term.de }
  }
}

export const homePosts = (posts: readonly PublishedPost[], locale: PostLanguage) =>
  journalIndexPosts(posts, locale).slice(0, HOME_POSTS)

export const postEntries = (posts: readonly PublishedPost[], locale: PostLanguage): PostEntry[] =>
  journalIndexPosts(posts, locale).map(({ slug, metadata }) => ({ slug, title: metadata.title, lang: metadata.lang }))

const WORDS_PER_MINUTE = 220

// Reading time from the MDX source: prose only, without the metadata export, code blocks, tags and expressions.
export const readingMinutes = (source: string) => {
  const prose = source
    .replace(/^export const metadata = [\s\S]*?^}\n/m, '')
    .replace(/^```[\s\S]*?^```/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')

  const words = prose.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

// The h2 headings, which the homepage explorer shows as the children of the file.
export const outlineHeadings = (outline: readonly OutlineItem[]) =>
  outline.filter(item => item.depth === 2).map(({ id, text }) => ({ id, text }))

export type PostStats = Readonly<{ minutes: number | null; terms: number; clips: number }>

// Only what exists: terms in learning.json, and the German clips that audio.json lists for the current text.
export const postStats = ({ learning, audio, metadata }: PublishedPost, minutes: number | null): PostStats => ({
  minutes,
  terms: Object.keys(learning?.terms ?? {}).length,
  clips: learning
    ? [...audioItems(learning, audioConfig), ...narrationItems(learning, metadata.lang, audioConfig)].filter(
        item => audio?.clips[item.hash]
      ).length
    : 0
})

// Everything the homepage editor needs for one post, as plain data for its client component.
export type HomePost = Readonly<{
  slug: string
  lang: PostLanguage
  title: string
  summary: string
  hasTldr: boolean
  date: string
  category: string
  format: string
  headings: ReadonlyArray<Readonly<{ id: string; text: string }>>
  contrast: PostContrast | null
  stats: PostStats
}>
