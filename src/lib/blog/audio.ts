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

export type AudioConfig = Readonly<{
  model: string
  outputFormat: string
  language: string
  seed: number
  settings: AudioSettings
  voices: Readonly<{ narrator: string; speakers: readonly string[] }>
}>

export type AudioKind = 'term' | 'gloss' | 'dialog'

export type AudioItem = Readonly<{ kind: AudioKind; id: string; text: string; voice: string; hash: string }>

// Bump to regenerate every clip, for example after changing how the request is built.
const HASH_VERSION = 1

// The cache key: any change to what is spoken or how it is synthesized gives a new file name.
export const clipHash = (text: string, voice: string, config: AudioConfig) => {
  const settings = Object.entries(config.settings).sort(([a], [b]) => a.localeCompare(b))
  const key = [HASH_VERSION, text, config.language, voice, config.model, settings, config.outputFormat, config.seed]

  return createHash('sha256').update(JSON.stringify(key)).digest('hex').slice(0, 16)
}

export const glossText = (segments: readonly GlossSegment[]) =>
  segments.map(segment => (typeof segment === 'string' ? segment : segment.text)).join('')

// Speakers take the configured voices in declaration order; the narrator covers any speaker without one.
export const dialogueVoice = (dialogue: LearningEntry<'dialogues'>, speaker: string, config: AudioConfig) =>
  config.voices.speakers[Object.keys(dialogue.speakers).indexOf(speaker)] || config.voices.narrator

const item = (kind: AudioKind, id: string, text: string, voice: string, config: AudioConfig): AudioItem => ({
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

// An upper bound: multilingual models cost one credit per character, Flash and Turbo up to one.
export const estimateCredits = (items: readonly AudioItem[]) => items.reduce((sum, { text }) => sum + text.length, 0)

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
