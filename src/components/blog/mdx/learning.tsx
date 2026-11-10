import type { ReactNode } from 'react'

import type { MDXComponents } from 'mdx/types'

import { clipHash, clipPath, dialogueVoice, glossText, segmentTimes, type VoiceConfig } from '@/lib/blog/audio'
import { audioConfig } from '@/lib/blog/audio-config'
import type { LearningEntry, LearningKind } from '@/lib/blog/learning'
import type { PublishedPost } from '@/lib/blog/posts'

import Dialog from './dialog'
import Gloss from './gloss'
import Quiz from './quiz'
import Term from './term'

type IdProps = Readonly<{ id: string }>

const tags = { terms: 'Term', sentences: 'Gloss', dialogues: 'Dialog', quizzes: 'Quiz' } as const

/*
 * MDX props override the global mapping, so each article binds these to its own validated learning.json and the
 * client components receive one entry each. Every published slug is prebuilt, so an unknown id fails the build.
 */
export const learningComponents = ({ slug, metadata, learning, audio }: PublishedPost): MDXComponents => {
  const find = <K extends LearningKind>(kind: K, id: string): LearningEntry<K> => {
    const reference = `<${tags[kind]} id="${id}" /> in ${slug}/${metadata.lang}.mdx`

    if (!learning) throw new Error(`${reference} needs a registered learning.json.`)

    const entry = learning[kind]?.[id]

    if (!entry) throw new Error(`${reference} has no "${id}" in the ${kind} of learning.json.`)

    return entry as LearningEntry<K>
  }

  // Only clips listed in audio.json for the current text and config get a file; the rest fall back (docs/adr/0007).
  const clip = (text: string, voice: VoiceConfig) => {
    const hash = clipHash(text, voice, audioConfig)
    const entry = audio?.clips[hash]

    return { audio: { src: entry ? clipPath(slug, hash) : undefined, text }, timing: entry?.timing }
  }

  return {
    Term: ({ id, children }: IdProps & Readonly<{ children?: ReactNode }>) => {
      const term = find('terms', id)

      return (
        <Term de={term.de} en={term.en} note={term.note} audio={clip(term.de, audioConfig.voices.narrator).audio}>
          {children ?? term.de}
        </Term>
      )
    },
    Gloss: ({ id }: IdProps) => {
      const sentence = find('sentences', id)
      const { audio: sentenceAudio, timing } = clip(glossText(sentence.de), audioConfig.voices.narrator)

      return <Gloss de={sentence.de} en={sentence.en} audio={sentenceAudio} times={segmentTimes(sentence.de, timing)} />
    },
    Dialog: ({ id }: IdProps) => {
      const dialogue = find('dialogues', id)

      const lines = dialogue.lines.map(line => ({
        ...line,
        speaker: dialogue.speakers[line.speaker],
        audio: clip(line.de, dialogueVoice(dialogue, line.speaker, audioConfig)).audio
      }))

      return <Dialog title={dialogue.title} lines={lines} />
    },
    Quiz: ({ id }: IdProps) => <Quiz {...find('quizzes', id)} />
  }
}
