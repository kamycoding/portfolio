import { describe, expect, it } from 'vitest'

import { clipHash, clipPath } from './audio'
import { audioConfig } from './audio-config'
import { narrationSections } from './narration'
import type { PublishedPost } from './posts'

const post = (audio: PublishedPost['audio'], withNarration = true): PublishedPost => ({
  slug: 'fixture',
  Content: () => null,
  outline: [
    { id: 'intro', text: 'The intro', depth: 2 },
    { id: 'end', text: 'The end', depth: 2 }
  ],
  learning: withNarration
    ? {
        narration: [
          { heading: 'intro', text: 'Spoken intro.' },
          { heading: 'end', text: 'Spoken end.' }
        ]
      }
    : null,
  audio,
  metadata: {
    title: 'Narration fixture',
    description: 'Fixture.',
    date: '2026-11-10',
    category: 'engineering',
    format: 'note',
    tags: [],
    draft: false,
    lang: 'en'
  }
})

describe('narrationSections', () => {
  it('is null for a post without narration', () => {
    expect(narrationSections(post(null, false))).toBeNull()
  })

  it('has titles from the outline and no files before the clips exist', () => {
    expect(narrationSections(post(null))).toEqual([
      { id: 'intro', title: 'The intro', src: undefined },
      { id: 'end', title: 'The end', src: undefined }
    ])
  })

  it('offers a file only for a clip that audio.json lists for the English narrator', () => {
    const voice = audioConfig.voices.narration.en
    const hash = clipHash('Spoken intro.', voice, audioConfig, 'en')
    const clips = { [hash]: { text: 'Spoken intro.', model: voice.model, voice: voice.id } }

    expect(narrationSections(post({ version: 1, clips }))?.map(section => section.src)).toEqual([
      clipPath('fixture', hash),
      undefined
    ])
  })
})
