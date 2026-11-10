import { z } from 'zod'

import type { PostLanguage } from './schema'

// Entry ids follow the slug format, so MDX references like <Term id="feierabend" /> stay predictable.
const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase, hyphen-separated id.')
const text = z.string().trim().min(1)

// Plain strings stay unaligned; spaces and punctuation are written out, so the sentence renders exactly as authored.
const segmentSchema = z.union([z.string().min(1), z.strictObject({ text, group: idSchema })])

export type GlossSegment = z.infer<typeof segmentSchema>

const groupsOf = (segments: readonly GlossSegment[]) =>
  new Set(segments.flatMap(segment => (typeof segment === 'string' ? [] : [segment.group])))

const sentenceSchema = z
  .strictObject({ de: z.array(segmentSchema).min(1), en: z.array(segmentSchema).min(1) })
  .superRefine((sentence, context) => {
    const de = groupsOf(sentence.de)
    const en = groupsOf(sentence.en)

    if (de.size === 0) context.addIssue({ code: 'custom', message: 'A sentence needs at least one aligned group.' })

    for (const group of de) {
      if (!en.has(group)) context.addIssue({ code: 'custom', path: ['en'], message: `Group "${group}" is missing.` })
    }

    for (const group of en) {
      if (!de.has(group)) context.addIssue({ code: 'custom', path: ['de'], message: `Group "${group}" is missing.` })
    }
  })

/*
 * One learning.json serves every translation of a post. Each translation parses it with its own language, so
 * reader-facing text ({ en, de }) must exist in that language and resolves to a plain string (docs/adr/0007).
 */
const createLearningSchema = (lang: PostLanguage) => {
  const localized = z
    .strictObject({ en: text.optional(), de: text.optional() })
    .refine(value => value[lang] !== undefined, `Missing the "${lang}" text.`)
    .transform(value => value[lang]!)

  const termSchema = z.strictObject({ de: text, en: text, note: localized.optional() })

  const dialogueSchema = z
    .strictObject({
      title: localized.optional(),
      speakers: z.record(idSchema, text),
      lines: z.array(z.strictObject({ speaker: idSchema, de: text, en: text })).min(1)
    })
    .superRefine((dialogue, context) => {
      dialogue.lines.forEach((line, index) => {
        if (!(line.speaker in dialogue.speakers)) {
          context.addIssue({ code: 'custom', path: ['lines', index, 'speaker'], message: 'Unknown speaker.' })
        }
      })
    })

  const quizSchema = z
    .strictObject({
      question: localized,
      choices: z
        .array(z.strictObject({ id: idSchema, text: localized }))
        .min(2)
        .max(6),
      answer: idSchema,
      explanation: localized
    })
    .superRefine((quiz, context) => {
      const ids = quiz.choices.map(choice => choice.id)

      if (new Set(ids).size !== ids.length) {
        context.addIssue({ code: 'custom', path: ['choices'], message: 'Choice ids must be unique.' })
      }

      if (!ids.includes(quiz.answer)) {
        context.addIssue({ code: 'custom', path: ['answer'], message: 'The answer must be one of the choice ids.' })
      }
    })

  return z.strictObject({
    terms: z.record(idSchema, termSchema).optional(),
    sentences: z.record(idSchema, sentenceSchema).optional(),
    dialogues: z.record(idSchema, dialogueSchema).optional(),
    quizzes: z.record(idSchema, quizSchema).optional()
  })
}

export const learningSchemas = { en: createLearningSchema('en'), de: createLearningSchema('de') }

export type Learning = z.output<(typeof learningSchemas)['en']>
export type LearningKind = keyof Learning
export type LearningEntry<K extends LearningKind> = NonNullable<Learning[K]>[string]
