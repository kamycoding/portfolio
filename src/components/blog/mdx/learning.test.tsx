import type { ComponentType, ReactElement, ReactNode } from 'react'

import { renderToStaticMarkup } from 'react-dom/server'

import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'

import { type AudioManifest, clipHash, glossText } from '@/lib/blog/audio'
import { audioConfig } from '@/lib/blog/audio-config'
import { learningSchemas } from '@/lib/blog/learning'
import type { PublishedPost } from '@/lib/blog/posts'

import messages from '../../../../messages/en.json'

import Callout from './callout'
import Figure from './figure'
import { learningComponents } from './learning'
import { TLDR } from './summary'

const learning = learningSchemas.en.parse({
  terms: { feierabend: { de: 'der Feierabend', en: 'end of work', note: { en: 'A note.' } } },
  sentences: {
    call: {
      de: ['Ich ', { text: 'rufe', group: 'call' }, ' dich ', { text: 'an', group: 'call' }, '.'],
      en: ['I will ', { text: 'call', group: 'call' }, ' you.']
    }
  },
  dialogues: { standup: { speakers: { a: 'Speaker A' }, lines: [{ speaker: 'a', de: 'Hallo.', en: 'Hello.' }] } },
  quizzes: {
    first: {
      question: { en: 'Question?' },
      choices: [
        { id: 'a', text: { en: 'A' } },
        { id: 'b', text: { en: 'B' } }
      ],
      answer: 'b',
      explanation: { en: 'Because.' }
    }
  }
})

const post = (data: PublishedPost['learning'] = learning, audio: AudioManifest | null = null): PublishedPost => ({
  slug: 'fixture',
  Content: () => null,
  outline: [],
  learning: data,
  audio,
  metadata: {
    title: 'Fixture',
    description: 'Fixture.',
    date: '2026-11-10',
    category: 'learning',
    format: 'note',
    tags: [],
    draft: false,
    lang: 'en'
  }
})

const render = (element: ReactElement) =>
  renderToStaticMarkup(
    <NextIntlClientProvider locale='en' messages={messages}>
      {element}
    </NextIntlClientProvider>
  )

type Bound = Record<string, ComponentType<{ id: string; children?: ReactNode }>>

const { Term, Gloss, Dialog, Quiz } = learningComponents(post()) as Bound

describe('learningComponents', () => {
  it('names the file and the id when an entry does not exist', () => {
    expect(() => render(<Term id='missing' />)).toThrow(
      '<Term id="missing" /> in fixture/en.mdx has no "missing" in the terms of learning.json.'
    )
  })

  it('names the file when the post has no learning.json', () => {
    const { Quiz: Unbound } = learningComponents(post(null)) as Bound

    expect(() => render(<Unbound id='first' />)).toThrow('needs a registered learning.json')
  })

  it('renders Term as a popover disclosure that defaults to the German form', () => {
    const html = render(<Term id='feierabend' />)
    const id = html.match(/popovertarget="([^"]+)"/i)![1]

    expect(html).toContain(`aria-controls="${id}" aria-expanded="false"`)
    expect(html).toContain(`id="${id}" popover="auto"`)
    expect(html).toMatch(/<button[^>]*lang="de"[^>]*>der Feierabend<\/button>/)
    expect(html).toContain('<span lang="en">end of work</span>')
    expect(render(<Term id='feierabend'>Feierabends</Term>)).toMatch(/>Feierabends<\/button>/)
  })

  it('renders one Gloss control per group, described by its English parts', () => {
    const html = render(<Gloss id='call' />)
    const described = html.match(/aria-describedby="([^"]+)"/)![1]

    expect(html.match(/<button[^>]*data-group/g)).toHaveLength(1)
    expect(html).toContain(`id="${described}"`)
    expect(html).not.toContain('data-active')
  })

  it('renders Dialog with speaker names and the English lines hidden', () => {
    const html = render(<Dialog id='standup' />)

    expect(html).toContain('aria-pressed="false"')
    expect(html).toContain('Speaker A')
    expect(html).toContain('<p lang="en" class="')
    expect(html).toMatch(/<p lang="en"[^>]*hidden="">Hello.<\/p>/)
  })

  it('renders Quiz with native radios, a submit button and an empty live region', () => {
    const html = render(<Quiz id='first' />)

    expect(html.match(/type="radio"/g)).toHaveLength(2)
    expect(html).toContain('<legend')
    expect(html).toMatch(/<button type="submit"[^>]*>Check<\/button>/)
    expect(html).toMatch(/<div role="status"[^>]*><\/div>/)
  })
})

describe('audio', () => {
  const narrator = audioConfig.voices.narrator
  const termHash = clipHash('der Feierabend', narrator, audioConfig)
  const sentenceText = glossText(learning.sentences!.call.de)
  const sentenceHash = clipHash(sentenceText, narrator, audioConfig)
  const lineHash = clipHash('Hallo.', audioConfig.voices.speakers[0], audioConfig)

  const manifest: AudioManifest = {
    version: 1,
    clips: {
      [termHash]: { text: 'der Feierabend', model: narrator.model, voice: narrator.id },
      [lineHash]: {
        text: 'Hallo.',
        model: audioConfig.voices.speakers[0].model,
        voice: audioConfig.voices.speakers[0].id
      },
      [sentenceHash]: {
        text: sentenceText,
        model: narrator.model,
        voice: narrator.id,
        timing: { start: [...sentenceText].map((_, i) => i * 100), end: [...sentenceText].map((_, i) => i * 100 + 90) }
      }
    }
  }

  const bound = learningComponents(post(learning, manifest)) as Bound

  it('offers a listed clip through a native audio element that loads nothing before a click', () => {
    const html = render(<bound.Term id='feierabend' />)

    expect(html).toContain(`<audio src="/blog-audio/fixture/${termHash}.mp3" preload="none"></audio>`)
    expect(html).toMatch(/<button type="button"[^>]*aria-label="Play pronunciation"/)
    expect(html).not.toContain('autoplay')
  })

  it('renders an unavailable, still focusable button when no clip is listed', () => {
    const html = render(<Term id='feierabend' />)

    expect(html).not.toContain('<audio')
    expect(html).toMatch(/aria-label="Audio unavailable" aria-disabled="true"/)
    expect(html).not.toMatch(/aria-label="Audio unavailable"[^>]* disabled=""/)
  })

  it('names each dialogue line button by number and speaker', () => {
    const html = render(<bound.Dialog id='standup' />)

    expect(html).toContain('aria-label="Play line 1, Speaker A"')
    expect(html).toContain(`/blog-audio/fixture/${lineHash}.mp3`)
  })

  it('ignores a clip whose text no longer matches the hash', () => {
    const stale = {
      version: 1 as const,
      clips: { [clipHash('der Feierabend!', narrator, audioConfig)]: manifest.clips[termHash] }
    }

    const { Term: StaleTerm } = learningComponents(post(learning, stale)) as Bound

    expect(render(<StaleTerm id='feierabend' />)).not.toContain('<audio')
  })

  it('offers the sentence clip with its button', () => {
    const html = render(<bound.Gloss id='call' />)

    expect(html).toContain(`/blog-audio/fixture/${sentenceHash}.mp3`)
    expect(html).toContain('aria-label="Play sentence"')
  })
})

describe('content blocks', () => {
  it('labels a Callout with its kind and title', () => {
    const html = render(
      <Callout type='tip' title='Title'>
        Body
      </Callout>
    )

    expect(html).toContain('role="note"')
    expect(html).toMatch(/>Tip<\/span>/)
    expect(html).toContain('Title')
  })

  it('labels TLDR as a region without adding a heading', () => {
    const html = render(<TLDR>Body</TLDR>)
    const id = html.match(/aria-labelledby="([^"]+)"/)![1]

    expect(html).toContain(`id="${id}"`)
    expect(html).not.toMatch(/<h\d/)
  })

  it('renders Figure with the intrinsic size and requires alt text', () => {
    const src = { src: '/_next/static/media/shot.webp', width: 1200, height: 600 }

    expect(
      render(
        <Figure src={src} alt='A screenshot'>
          Caption
        </Figure>
      )
    ).toContain('width="1200" height="600" alt="A screenshot"')
    expect(() => render(<Figure src={src} alt={undefined as unknown as string} />)).toThrow('needs alt text')
  })
})
