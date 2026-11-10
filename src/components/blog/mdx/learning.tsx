import type { ReactNode } from 'react'

import type { MDXComponents } from 'mdx/types'

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
export const learningComponents = ({ slug, metadata, learning }: PublishedPost): MDXComponents => {
  const find = <K extends LearningKind>(kind: K, id: string): LearningEntry<K> => {
    const reference = `<${tags[kind]} id="${id}" /> in ${slug}/${metadata.lang}.mdx`

    if (!learning) throw new Error(`${reference} needs a registered learning.json.`)

    const entry = learning[kind]?.[id]

    if (!entry) throw new Error(`${reference} has no "${id}" in the ${kind} of learning.json.`)

    return entry as LearningEntry<K>
  }

  return {
    Term: ({ id, children }: IdProps & Readonly<{ children?: ReactNode }>) => {
      const term = find('terms', id)

      return (
        <Term de={term.de} en={term.en} note={term.note}>
          {children ?? term.de}
        </Term>
      )
    },
    Gloss: ({ id }: IdProps) => {
      const sentence = find('sentences', id)

      return <Gloss de={sentence.de} en={sentence.en} />
    },
    Dialog: ({ id }: IdProps) => {
      const { title, speakers, lines } = find('dialogues', id)

      return <Dialog title={title} lines={lines.map(line => ({ ...line, speaker: speakers[line.speaker] }))} />
    },
    Quiz: ({ id }: IdProps) => <Quiz {...find('quizzes', id)} />
  }
}
