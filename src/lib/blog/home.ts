import { audioItems, clipPath } from './audio'
import { audioConfig } from './audio-config'
import { narrationSections } from './narration'
import type { PublishedPost } from './posts'
import { journalIndexPosts } from './routes'
import type { PostLanguage, PreviewLine } from './schema'

// The homepage lists the newest posts as open editors; the index has the rest.
export const HOME_POSTS = 12

// What the terminal and the command palette need to list and open a post.
export type PostEntry = Readonly<{ slug: string; title: string; lang: PostLanguage }>

export const homePosts = (posts: readonly PublishedPost[], locale: PostLanguage) =>
  journalIndexPosts(posts, locale).slice(0, HOME_POSTS)

export const postEntries = (posts: readonly PublishedPost[], locale: PostLanguage): PostEntry[] =>
  journalIndexPosts(posts, locale).map(({ slug, metadata }) => ({ slug, title: metadata.title, lang: metadata.lang }))

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

// A heading line of the source: "## Title" or a JSX heading such as <h2 id="intro">Title</h2>.
const H2_LINE = /^(?:##\s.*|<h2\b.*<\/h2>)$/m

/*
 * The text length of each h2 section relative to the longest one, in reading order, for the card's minimap. Null when
 * the headings found in the source do not match the outline, so a bar never describes the wrong section.
 */
export const sectionWeights = (source: string, sections: number): number[] | null => {
  const sectionsOfText = source
    .replace(/^```[\s\S]*?^```/gm, '')
    .replace(/^export const metadata = [\s\S]*?^}\n/m, '')
    .split(H2_LINE)
    .slice(1)

  if (sections === 0 || sectionsOfText.length !== sections) return null

  const counts = sectionsOfText.map(section => wordCount(proseOf(section)))
  const longest = Math.max(...counts, 1)

  // A section is never so short that its bar disappears.
  return counts.map(count => Math.max(0.1, count / longest))
}

// "german-for-developers-dailies-calls" -> "german-for-developers…": whole words, a tab has little room.
export const shortName = (slug: string, max = 22) => {
  if (slug.length <= max) return slug

  const [first, ...rest] = slug.split('-')
  let name = first

  for (const word of rest) {
    if (`${name}-${word}`.length > max) break

    name += `-${word}`
  }

  return `${name}…`
}

// One line of the TL;DR as a comment, cut at a word.
export const shorten = (text: string, max = 96) => {
  if (text.length <= max) return text

  const cut = text.lastIndexOf(' ', max)

  return `${text.slice(0, cut > 0 ? cut : max).replace(/[.,;:]$/, '')}…`
}

export type CardClip = Readonly<{ src: string; text: string }>

/*
 * What the Listen action plays: the first narration section, or else the article's first clip. A clip counts only
 * when audio.json lists it for the current text and voice (docs/adr/0007).
 */
export const firstClip = (post: PublishedPost): CardClip | null => {
  const narrated = narrationSections(post)?.find(section => section.src)

  if (narrated?.src) return { src: narrated.src, text: narrated.title }

  const { learning, audio, slug } = post
  const item = learning && audio ? audioItems(learning, audioConfig).find(entry => audio.clips[entry.hash]) : undefined

  return item ? { src: clipPath(slug, item.hash), text: item.text } : null
}

// Everything one open editor card needs, as plain data.
export type EditorCard = Readonly<{
  slug: string
  fileName: string
  lang: PostLanguage

  // Every published translation, and the one the card can switch to.
  languages: readonly PostLanguage[]
  other: PostLanguage | null
  title: string
  summary: string
  date: string
  categoryId: string
  category: string
  tags: readonly string[]
  preview: readonly PreviewLine[]
  minimap: readonly number[] | null
  minutes: number | null
  badges: Readonly<{ audio: boolean; interactive: boolean; quiz: boolean }>
  listen: CardClip | null
  url: string
}>

export const cardBadges = (post: PublishedPost, listen: CardClip | null) => ({
  audio: listen !== null,
  interactive: post.metadata.format === 'interactive',
  quiz: Object.keys(post.learning?.quizzes ?? {}).length > 0
})
