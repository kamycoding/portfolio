import { describe, expect, it } from 'vitest'

import {
  type AudioConfig,
  audioItems,
  audioManifestSchema,
  clipHash,
  dialogueVoice,
  estimateCredits,
  narrationItems,
  requestSettings,
  segmentTimes,
  sendsLanguageCode,
  withModel
} from './audio'
import { learningSchemas } from './learning'

const narrator = { id: 'narrator', model: 'eleven_multilingual_v2' }
const first = { id: 'first', model: 'eleven_flash_v2_5' }

const config: AudioConfig = {
  outputFormat: 'mp3_44100_128',
  language: 'de',
  seed: 1,
  settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 1 },
  voices: { narrator, speakers: [first], narration: { en: { id: 'lawrence', model: 'eleven_v4' }, de: narrator } }
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

    expect(clipHash('Hallo.', narrator, config)).toMatch(/^[0-9a-f]{16}$/)
    expect(clipHash('Hallo.', narrator, reordered)).toBe(clipHash('Hallo.', narrator, config))
  })

  it('keeps the key of the published layout for existing models', () => {
    // Pinned, so a refactor cannot silently rename every committed clip.
    const voice = { id: 'vv3bG6FrcGtmeOdRSriS', model: 'eleven_multilingual_v2' }

    expect(clipHash('der Feierabend', voice, config)).toBe('e53ca332a43a4d0e')
  })

  it('changes with every input of the cache key', () => {
    const base = clipHash('Hallo.', narrator, config)

    const variants = [
      clipHash('Hallo!', narrator, config),
      clipHash('Hallo.', { ...narrator, id: 'other' }, config),
      clipHash('Hallo.', { ...narrator, model: 'other' }, config),
      clipHash('Hallo.', narrator, { ...config, language: 'en' }),
      clipHash('Hallo.', narrator, { ...config, outputFormat: 'mp3_44100_64' }),
      clipHash('Hallo.', narrator, { ...config, seed: 2 }),
      clipHash('Hallo.', narrator, { ...config, settings: { ...config.settings, speed: 0.9 } })
    ]

    expect(new Set([base, ...variants]).size).toBe(variants.length + 1)
  })

  it('ignores settings that Eleven v4 never receives', () => {
    const v4 = { id: 'narrator', model: 'eleven_v4' }
    const faster = { ...config, settings: { ...config.settings, speed: 0.9, style: 0.3 } }

    expect(clipHash('Hallo.', v4, faster)).toBe(clipHash('Hallo.', v4, config))
    expect(clipHash('Hallo.', v4, { ...config, settings: { ...config.settings, stability: 0.3 } })).not.toBe(
      clipHash('Hallo.', v4, config)
    )
  })
})

describe('model rules', () => {
  it('sends only stability and similarity to Eleven v4', () => {
    expect(requestSettings('eleven_v4', config.settings)).toEqual({ stability: 0.5, similarity_boost: 0.75 })
    expect(requestSettings('eleven_multilingual_v2', config.settings)).toEqual(config.settings)
  })

  it('sends language_code to models that enforce it, not to multilingual v2', () => {
    expect(sendsLanguageCode('eleven_v4')).toBe(true)
    expect(sendsLanguageCode('eleven_flash_v2_5')).toBe(true)
    expect(sendsLanguageCode('eleven_multilingual_v2')).toBe(false)
  })

  it('overrides every voice model for samples and keeps the voice ids', () => {
    const sample = withModel(config, 'eleven_v4')

    expect(sample.voices.narrator).toEqual({ id: 'narrator', model: 'eleven_v4' })
    expect(sample.voices.speakers).toEqual([{ id: 'first', model: 'eleven_v4' }])
    expect(sample.voices.narration.en).toEqual({ id: 'lawrence', model: 'eleven_v4' })
  })
})

describe('audioItems', () => {
  it('voices terms, sentences and every dialogue line in German, each with its voice and model', () => {
    expect(audioItems(learning, config).map(({ kind, id, text, voice }) => [kind, id, text, voice])).toEqual([
      ['term', 'feierabend', 'der Feierabend', narrator],
      ['gloss', 'call', 'Ich rufe dich an.', narrator],
      ['dialog', 'standup/1', 'Hallo.', first],
      ['dialog', 'standup/2', 'Tschüss.', narrator]
    ])
  })

  it('assigns speaker voices in declaration order with the narrator as fallback', () => {
    const dialogue = learning.dialogues!.standup

    expect(dialogueVoice(dialogue, 'a', config)).toBe(first)
    expect(dialogueVoice(dialogue, 'b', config)).toBe(narrator)
  })
})

describe('estimateCredits', () => {
  it('adds one credit per character as an upper bound for known models', () => {
    expect(estimateCredits(audioItems(learning, config))).toEqual({
      characters: 14 + 17 + 6 + 8,
      credits: 14 + 17 + 6 + 8,
      unknown: []
    })
  })

  it('reports models without a published rate instead of guessing', () => {
    const estimate = estimateCredits(audioItems(learning, withModel(config, 'eleven_v4')))

    expect(estimate).toEqual({ characters: 45, credits: null, unknown: ['eleven_v4'] })
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

describe('narrationItems', () => {
  const withNarration = learningSchemas.en.parse({
    narration: [
      { heading: 'intro', text: { en: 'First section.', de: 'Erster Abschnitt.' } },
      { heading: 'end', text: { en: 'Last section.' } }
    ]
  })

  it('makes one clip per section with the narrator and language of the translation', () => {
    const items = narrationItems(withNarration, 'en', config)

    expect(items.map(({ kind, id, text, lang, voice }) => [kind, id, text, lang, voice.id])).toEqual([
      ['narration', 'en/intro', 'First section.', 'en', 'lawrence'],
      ['narration', 'en/end', 'Last section.', 'en', 'lawrence']
    ])
  })

  it('hashes the spoken language, and leaves German clips with their old names', () => {
    const [english] = narrationItems(withNarration, 'en', config)

    expect(english.hash).toBe(clipHash('First section.', config.voices.narration.en, config, 'en'))
    expect(english.hash).not.toBe(clipHash('First section.', config.voices.narration.en, config))
    expect(audioItems(learning, config)[0].lang).toBe('de')
  })

  it('has no clips without a narration', () => {
    expect(narrationItems(learning, 'en', config)).toEqual([])
  })
})
