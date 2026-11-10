import { describe, expect, it } from 'vitest'

import {
  type AudioConfig,
  audioItems,
  audioManifestSchema,
  clipHash,
  dialogueVoice,
  estimateCredits,
  segmentTimes
} from './audio'
import { learningSchemas } from './learning'

const config: AudioConfig = {
  model: 'model',
  outputFormat: 'mp3_44100_128',
  language: 'de',
  seed: 1,
  settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 1 },
  voices: { narrator: 'narrator', speakers: ['first'] }
}

const sentence = {
  de: ['Ich ', { text: 'rufe', group: 'call' }, ' dich ', { text: 'an', group: 'call' }, '.'],
  en: ['I will ', { text: 'call', group: 'call' }, ' you.']
}

const learning = learningSchemas.en.parse({
  terms: { feierabend: { de: 'der Feierabend', en: 'end of work' } },
  sentences: { call: sentence },
  dialogues: {
    standup: {
      speakers: { a: 'A', b: 'B' },
      lines: [
        { speaker: 'a', de: 'Hallo.', en: 'Hello.' },
        { speaker: 'b', de: 'Tschüss.', en: 'Bye.' }
      ]
    }
  }
})

describe('clipHash', () => {
  it('is stable and ignores the order of the settings', () => {
    const reordered = {
      ...config,
      settings: { speed: 1, style: 0, use_speaker_boost: true, similarity_boost: 0.75, stability: 0.5 }
    }

    expect(clipHash('Hallo.', 'voice', config)).toMatch(/^[0-9a-f]{16}$/)
    expect(clipHash('Hallo.', 'voice', reordered)).toBe(clipHash('Hallo.', 'voice', config))
  })

  it('changes with every input of the cache key', () => {
    const base = clipHash('Hallo.', 'voice', config)

    const variants = [
      clipHash('Hallo!', 'voice', config),
      clipHash('Hallo.', 'other', config),
      clipHash('Hallo.', 'voice', { ...config, model: 'other' }),
      clipHash('Hallo.', 'voice', { ...config, language: 'en' }),
      clipHash('Hallo.', 'voice', { ...config, outputFormat: 'mp3_44100_64' }),
      clipHash('Hallo.', 'voice', { ...config, seed: 2 }),
      clipHash('Hallo.', 'voice', { ...config, settings: { ...config.settings, speed: 0.9 } })
    ]

    expect(new Set([base, ...variants]).size).toBe(variants.length + 1)
  })
})

describe('audioItems', () => {
  it('voices terms, sentences and every dialogue line in German', () => {
    expect(audioItems(learning, config).map(({ kind, id, text, voice }) => [kind, id, text, voice])).toEqual([
      ['term', 'feierabend', 'der Feierabend', 'narrator'],
      ['gloss', 'call', 'Ich rufe dich an.', 'narrator'],
      ['dialog', 'standup/1', 'Hallo.', 'first'],
      ['dialog', 'standup/2', 'Tschüss.', 'narrator']
    ])
  })

  it('assigns speaker voices in declaration order with the narrator as fallback', () => {
    const dialogue = learning.dialogues!.standup

    expect(dialogueVoice(dialogue, 'a', config)).toBe('first')
    expect(dialogueVoice(dialogue, 'b', config)).toBe('narrator')
  })

  it('estimates one credit per character as an upper bound', () => {
    expect(estimateCredits(audioItems(learning, config))).toBe(14 + 17 + 6 + 8)
  })
})

describe('audio manifest', () => {
  const clip = { text: 'Hallo.', model: 'model', voice: 'voice' }

  it('accepts clips with and without timing', () => {
    const timing = { start: [0, 1, 2, 3, 4, 5], end: [1, 2, 3, 4, 5, 6] }

    expect(audioManifestSchema.safeParse({ version: 1, clips: { '0123456789abcdef': clip } }).success).toBe(true)
    expect(
      audioManifestSchema.safeParse({ version: 1, clips: { '0123456789abcdef': { ...clip, timing } } }).success
    ).toBe(true)
  })

  it('rejects malformed keys and timing that does not match the text', () => {
    const short = { start: [0], end: [1] }

    expect(audioManifestSchema.safeParse({ version: 1, clips: { 'not-a-hash': clip } }).success).toBe(false)
    expect(
      audioManifestSchema.safeParse({ version: 1, clips: { '0123456789abcdef': { ...clip, timing: short } } }).success
    ).toBe(false)
  })
})

describe('segmentTimes', () => {
  const segments = learning.sentences!.call.de
  const text = 'Ich rufe dich an.'
  const timing = { start: [...text].map((_, i) => i * 100), end: [...text].map((_, i) => i * 100 + 90) }

  it('maps character timing onto the aligned segments', () => {
    expect(segmentTimes(segments, timing)).toEqual([
      null,
      { start: 400, end: 790 },
      null,
      { start: 1400, end: 1590 },
      null
    ])
  })

  it('gives up when the timing does not cover exactly the displayed text', () => {
    expect(segmentTimes(segments, { start: [0], end: [1] })).toBeNull()
    expect(segmentTimes(segments, undefined)).toBeNull()
  })
})
