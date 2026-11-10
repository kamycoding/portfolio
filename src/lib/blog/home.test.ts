import { describe, expect, it } from 'vitest'

import { clipHash, clipPath } from './audio'
import { audioConfig } from './audio-config'
import {
  cardBadges,
  firstClip,
  HOME_POSTS,
  homePosts,
  postEntries,
  readingMinutes,
  sectionWeights,
  shortName,
  shorten
} from './home'
import type { PublishedPost } from './posts'
import type { PostLanguage } from './schema'

const post = (slug: string, lang: PostLanguage, date: string, extra: Partial<PublishedPost> = {}): PublishedPost => ({
  slug,
  Content: () => null,
  outline: [],
  learning: null,
  audio: null,
  metadata: {
    title: `Title of ${slug}`,
    description: 'Home fixture.',
    date,
    category: 'learning',
    format: 'note',
    tags: [],
    draft: false,
    lang
  },
  ...extra
})

const learning = { terms: { stuck: { de: 'Da häng ich grad ein bisschen.', en: "I'm a bit stuck there." } } }

describe('homePosts', () => {
  it('is empty while nothing is published, which hides the section', () => {
    expect(homePosts([], 'en')).toEqual([])
  })

  it('keeps one entry per slug in the best language, newest first', () => {
    const posts = [
      post('a', 'en', '2026-11-01'),
      post('b', 'en', '2026-11-04'),
      post('b', 'de', '2026-11-04'),
      post('c', 'en', '2026-11-03')
    ]

    expect(homePosts(posts, 'de').map(item => `${item.slug}/${item.metadata.lang}`)).toEqual(['b/de', 'c/en', 'a/en'])
    expect(HOME_POSTS).toBeGreaterThan(3)
  })
})

describe('postEntries', () => {
  it('lists every post with the language it opens in', () => {
    const posts = [post('a', 'en', '2026-11-01'), post('b', 'de', '2026-11-02')]

    expect(postEntries(posts, 'en')).toEqual([
      { slug: 'b', title: 'Title of b', lang: 'de' },
      { slug: 'a', title: 'Title of a', lang: 'en' }
    ])
  })
})

describe('readingMinutes', () => {
  it('counts prose only and rounds up', () => {
    const body = Array.from({ length: 300 }, () => 'word').join(' ')
    const source = `export const metadata = {\n  title: 'ignored words here'\n}\n\n<Callout>${body}</Callout>\n\n\`\`\`js\nconst ignored = 1\n\`\`\`\n`

    expect(readingMinutes(source)).toBe(2)
    expect(readingMinutes('short')).toBe(1)
  })
})

describe('sectionWeights', () => {
  const source = `export const metadata = {\n  title: 'x'\n}\n\nIntro words.\n\n## One\n\n${'a '.repeat(40)}\n\n<h2 id="two">Two</h2>\n\n${'b '.repeat(20)}\n\n\`\`\`md\n## not a heading\n\`\`\`\n`

  it('is proportional to the longest section, in reading order, for both heading styles', () => {
    expect(sectionWeights(source, 2)).toEqual([1, 0.5])
  })

  it('is null when the source does not match the outline', () => {
    expect(sectionWeights(source, 3)).toBeNull()
    expect(sectionWeights(source, 0)).toBeNull()
  })
})

describe('shortName', () => {
  it('keeps short slugs and cuts long ones at a word', () => {
    expect(shortName('short-post')).toBe('short-post')
    expect(shortName('german-for-developers-dailies-calls')).toBe('german-for-developers…')
    expect(shortName('javascript-event-loop-explained')).toBe('javascript-event-loop…')
  })
})

describe('shorten', () => {
  it('cuts at a word and leaves short text alone', () => {
    expect(shorten('A short line.')).toBe('A short line.')
    expect(shorten('one two three four five', 12)).toBe('one two…')
  })
})

describe('firstClip and cardBadges', () => {
  it('has no clip before audio.json lists one', () => {
    expect(firstClip(post('a', 'en', '2026-11-01', { learning }))).toBeNull()
  })

  it('plays the first listed term clip when there is no narration', () => {
    const hash = clipHash(learning.terms.stuck.de, audioConfig.voices.narrator, audioConfig)
    const clips = { [hash]: { text: learning.terms.stuck.de, model: 'model', voice: 'voice' } }
    const withAudio = post('a', 'en', '2026-11-01', { learning, audio: { version: 1, clips } })
    const clip = firstClip(withAudio)

    expect(clip).toEqual({ src: clipPath('a', hash), text: learning.terms.stuck.de })
    expect(cardBadges(withAudio, clip)).toEqual({ audio: true, interactive: false, quiz: false })
  })

  it('prefers the first narration section', () => {
    const entry = { heading: 'intro', text: 'Spoken intro.' }
    const voice = audioConfig.voices.narration.en
    const hash = clipHash(entry.text, voice, audioConfig, 'en')
    const clips = { [hash]: { text: entry.text, model: voice.model, voice: voice.id } }

    const narrated = post('a', 'en', '2026-11-01', {
      outline: [{ id: 'intro', text: 'The intro', depth: 2 }],
      learning: { narration: [entry] },
      audio: { version: 1, clips }
    })

    expect(firstClip(narrated)).toEqual({ src: clipPath('a', hash), text: 'The intro' })
  })
})
