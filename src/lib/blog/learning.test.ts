import { describe, expect, it } from 'vitest'

import { learningSchemas } from './learning'

const sentence = {
  de: ['Ich ', { text: 'rufe', group: 'call' }, ' dich ', { text: 'an', group: 'call' }, '.'],
  en: ['I will ', { text: 'call', group: 'call' }, ' you.']
}

const quiz = {
  question: { en: 'Question?' },
  choices: [
    { id: 'a', text: { en: 'A' } },
    { id: 'b', text: { en: 'B' } }
  ],
  answer: 'b',
  explanation: { en: 'Because.' }
}

const dialogue = {
  title: { en: 'Title' },
  speakers: { a: 'Speaker A' },
  lines: [{ speaker: 'a', de: 'Hallo.', en: 'Hello.' }]
}

const parse = (value: unknown, lang: 'en' | 'de' = 'en') => learningSchemas[lang].safeParse(value)

describe('learning.json schema', () => {
  it('accepts an empty file and every section', () => {
    expect(parse({}).success).toBe(true)

    const result = parse({
      terms: { feierabend: { de: 'der Feierabend', en: 'end of work' } },
      sentences: { 'call-you': sentence },
      dialogues: { standup: dialogue },
      quizzes: { first: quiz }
    })

    expect(result.success).toBe(true)
    expect(result.data?.quizzes?.first.question).toBe('Question?')
    expect(result.data?.dialogues?.standup.title).toBe('Title')
  })

  it('requires reader-facing text in the parsing language', () => {
    expect(parse({ quizzes: { first: quiz } }, 'de').success).toBe(false)
  })

  it('rejects unknown keys, so later fields are added deliberately', () => {
    expect(parse({ terms: { x: { de: 'a', en: 'b', audio: 'x.mp3' } } }).success).toBe(false)
    expect(parse({ glossary: {} }).success).toBe(false)
  })

  it('rejects ids outside the slug format', () => {
    expect(parse({ terms: { Feierabend: { de: 'a', en: 'b' } } }).success).toBe(false)
  })

  it('requires the same aligned groups on both sides of a sentence', () => {
    const missing = { ...sentence, en: ['I will call you.'] }
    const extra = { ...sentence, en: [...sentence.en, { text: 'soon', group: 'soon' }] }

    expect(parse({ sentences: { s: missing } }).success).toBe(false)
    expect(parse({ sentences: { s: extra } }).success).toBe(false)
  })

  it('requires dialogue speakers to be declared', () => {
    const lines = [{ speaker: 'b', de: 'Hallo.', en: 'Hello.' }]

    expect(parse({ dialogues: { d: { ...dialogue, lines } } }).success).toBe(false)
  })

  it('requires unique choices and an answer among them', () => {
    const duplicate = { ...quiz, choices: [quiz.choices[0], quiz.choices[0]], answer: 'a' }

    expect(parse({ quizzes: { q: duplicate } }).success).toBe(false)
    expect(parse({ quizzes: { q: { ...quiz, answer: 'c' } } }).success).toBe(false)
    expect(parse({ quizzes: { q: { ...quiz, choices: [quiz.choices[0]], answer: 'a' } } }).success).toBe(false)
  })
})
