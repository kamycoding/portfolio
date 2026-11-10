import { createHash } from 'node:crypto'

import { z } from 'zod'

import type { GlossSegment, Learning, LearningEntry } from './learning'

/*
 * Shared by the article page and scripts/generate-audio.ts, which Node runs directly: only package and type imports
 * here, no extensionless relative runtime imports (docs/adr/0007).
 */
export type AudioSettings = Readonly<{
  stability: number
  similarity_boost: number
  style: number
  use_speaker_boost: boolean
  speed: number
}>

// Each voice names the model that suits it best; the model is part of every clip hash.
export type VoiceConfig = Readonly<{ id: string; model: string }>

export type AudioConfig = Readonly<{
  outputFormat: string
  language: string
  seed: number
  settings: AudioSettings
  voices: Readonly<{ narrator: VoiceConfig; speakers: readonly VoiceConfig[] }>
}>

export type AudioKind = 'term' | 'gloss' | 'dialog'

export type AudioItem = Readonly<{ kind: AudioKind; id: string; text: string; voice: VoiceConfig; hash: string }>

// Eleven v4 has only Stability and Similarity; its docs list no Style, Speed or speaker boost, so those are not sent.
const V4_MODELS = new Set(['eleven_v4', 'eleven_v4_turbo'])

export const requestSettings = (model: string, settings: AudioSettings): Partial<AudioSettings> =>
  V4_MODELS.has(model) ? { stability: settings.stability, similarity_boost: settings.similarity_boost } : settings

// Models that enforce language_code; multilingual v2 does not support it (docs/adr/0007).
const LANGUAGE_CODE_MODELS = new Set(['eleven_flash_v2_5', 'eleven_turbo_v2_5', ...V4_MODELS])

export const sendsLanguageCode = (model: string) => LANGUAGE_CODE_MODELS.has(model)

// Override every voice's model, for samples (--model).
export const withModel = (config: AudioConfig, model: string): AudioConfig => ({
  ...config,
  voices: {
    narrator: { ...config.voices.narrator, model },
    speakers: config.voices.speakers.map(voice => ({ ...voice, model }))
  }
})

// Bump to regenerate every clip, for example after changing how the request is built.
const HASH_VERSION = 1

// The cache key: any change to what is spoken or how it is synthesized gives a new file name.
export const clipHash = (text: string, voice: VoiceConfig, config: AudioConfig) => {
  const settings = Object.entries(requestSettings(voice.model, config.settings)).sort(([a], [b]) => a.localeCompare(b))
  const key = [HASH_VERSION, text, config.language, voice.id, voice.model, settings, config.outputFormat, config.seed]

  return createHash('sha256').update(JSON.stringify(key)).digest('hex').slice(0, 16)
}

export const glossText = (segments: readonly GlossSegment[]) =>
  segments.map(segment => (typeof segment === 'string' ? segment : segment.text)).join('')

// Speakers take the configured voices in declaration order; the narrator covers any speaker without one.
export const dialogueVoice = (dialogue: LearningEntry<'dialogues'>, speaker: string, config: AudioConfig) =>
  config.voices.speakers[Object.keys(dialogue.speakers).indexOf(speaker)] ?? config.voices.narrator

const item = (kind: AudioKind, id: string, text: string, voice: VoiceConfig, config: AudioConfig): AudioItem => ({
  kind,
  id,
  text,
  voice,
  hash: clipHash(text, voice, config)
})

// Only German is voiced: terms, Gloss sentences and every dialogue line.
export const audioItems = (learning: Learning, config: AudioConfig): AudioItem[] => [
  ...Object.entries(learning.terms ?? {}).map(([id, term]) =>
    item('term', id, term.de, config.voices.narrator, config)
  ),
  ...Object.entries(learning.sentences ?? {}).map(([id, sentence]) =>
    item('gloss', id, glossText(sentence.de), config.voices.narrator, config)
  ),
  ...Object.entries(learning.dialogues ?? {}).flatMap(([id, dialogue]) =>
    dialogue.lines.map((line, index) =>
      item('dialog', `${id}/${index + 1}`, line.de, dialogueVoice(dialogue, line.speaker, config), config)
    )
  )
]

/*
 * Upper bounds per character from ElevenLabs' pricing: multilingual v2 costs one credit, Flash and Turbo up to one.
 * Eleven v4 has no published rate yet, so its credits are reported as unknown instead of guessed.
 */
const CREDITS_PER_CHARACTER: Readonly<Record<string, number>> = {
  eleven_multilingual_v2: 1,
  eleven_flash_v2_5: 1,
  eleven_turbo_v2_5: 1
}

export const estimateCredits = (items: readonly AudioItem[]) => {
  const characters = items.reduce((sum, { text }) => sum + text.length, 0)
  const unknown = [...new Set(items.map(({ voice }) => voice.model))].filter(model => !CREDITS_PER_CHARACTER[model])

  const credits = unknown.length
    ? null
    : items.reduce((sum, { text, voice }) => sum + text.length * CREDITS_PER_CHARACTER[voice.model], 0)

  return { characters, credits, unknown }
}

const milliseconds = z.array(z.int().nonnegative())

const clipSchema = z
  .strictObject({
    text: z.string().min(1),
    model: z.string().min(1),
    voice: z.string().min(1),
    timing: z.strictObject({ start: milliseconds, end: milliseconds }).optional()
  })
  .refine(
    ({ text, timing }) => !timing || (timing.start.length === text.length && timing.end.length === text.length),
    'Timing must have one start and end per character.'
  )

// Written by scripts/generate-audio.ts next to learning.json; the page only offers clips listed here.
export const audioManifestSchema = z.strictObject({
  version: z.literal(1),
  clips: z.record(z.string().regex(/^[0-9a-f]{16}$/, 'Clip keys are 16-character hashes.'), clipSchema)
})

export type AudioManifest = z.infer<typeof audioManifestSchema>
export type AudioTiming = NonNullable<AudioManifest['clips'][string]['timing']>
export type SegmentTime = Readonly<{ start: number; end: number }> | null

export const clipPath = (slug: string, hash: string) => `/blog-audio/${slug}/${hash}.mp3`

// Start and end of each aligned German segment; null when the timing does not cover exactly the displayed text.
export const segmentTimes = (segments: readonly GlossSegment[], timing?: AudioTiming): SegmentTime[] | null => {
  if (!timing || timing.start.length !== glossText(segments).length) return null

  let offset = 0

  return segments.map(segment => {
    const text = typeof segment === 'string' ? segment : segment.text
    const first = offset

    offset += text.length

    return typeof segment === 'string' ? null : { start: timing.start[first], end: timing.end[offset - 1] }
  })
}
