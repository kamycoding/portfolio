import { describe, expect, it } from 'vitest'

import { articleCards, readingMinutes } from './card'
import type { PublishedPost } from './posts'
import type { PostLanguage } from './schema'

const post = (slug: string, lang: PostLanguage): PublishedPost => ({
  slug,
  Content: () => null,
  outline: [],
  learning: null,
  audio: null,
  metadata: {
    title: `Title of ${slug}`,
    description: 'Card fixture.',
    date: '2026-11-10',
    category: 'engineering',
    format: 'note',
    tags: [],
    draft: false,
    lang
  }
})

describe('readingMinutes', () => {
  it('counts prose only and rounds up', () => {
    const body = Array.from({ length: 300 }, () => 'word').join(' ')
    const source = `export const metadata = {\n  title: 'ignored words here'\n}\n\n<Callout>${body}</Callout>\n\n\`\`\`js\nconst ignored = 1\n\`\`\`\n`

    expect(readingMinutes(source)).toBe(2)
    expect(readingMinutes('short')).toBe(1)
  })
})

describe('articleCards', () => {
  it('lists every translation, English first, and leaves the reading time out without a source file', async () => {
    const all = [post('fixture', 'de'), post('fixture', 'en'), post('other', 'de')]
    const [card] = await articleCards(all, [all[0]])

    expect(card).toEqual({
      slug: 'fixture',
      lang: 'de',
      title: 'Title of fixture',
      description: 'Card fixture.',
      date: '2026-11-10',
      category: 'engineering',
      languages: ['en', 'de'],
      minutes: null
    })
  })

  it('reads the reading time from a published source', async () => {
    const [card] = await articleCards(
      [post('javascript-event-loop-explained', 'en')],
      [post('javascript-event-loop-explained', 'en')]
    )

    expect(card.minutes).toBeGreaterThan(0)
  })
})
