import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { createMeasure } from './metrics'
import { layoutTitle } from './title'

const NBSP = ' '

// One em per character keeps the arithmetic obvious.
const byLength = (text: string) => text.length

// At size 2 a line holds 20 characters, at size 1 it holds 40.
const options = { measure: byLength, maxWidth: 40, sizes: [2, 1] }

describe('layoutTitle', () => {
  it('keeps a title that fits on one line, with no-break spaces between its words', () => {
    expect(layoutTitle('Short title here', options)).toEqual({ size: 2, lines: [`Short${NBSP}title${NBSP}here`] })
  })

  it('splits a longer title into two balanced lines without ordinary spaces', () => {
    const layout = layoutTitle('alpha beta gamma delta epsilon', options)

    expect(layout).toEqual({ size: 2, lines: [`alpha${NBSP}beta${NBSP}gamma`, `delta${NBSP}epsilon`] })
    expect(layout?.lines.join('')).not.toContain(' ')
  })

  it('steps down a size before giving up', () => {
    expect(layoutTitle('a'.repeat(30), options)).toEqual({ size: 1, lines: ['a'.repeat(30)] })
  })

  it('returns null when no line arrangement fits, so the caller wraps normally', () => {
    expect(layoutTitle('w'.repeat(50), options)).toBeNull()
    expect(layoutTitle(`${'w'.repeat(25)} ${'w'.repeat(25)} ${'w'.repeat(25)}`, options)).toBeNull()
  })
})

describe('layoutTitle with Geist SemiBold at the 60-character limit', () => {
  const font = readFileSync(path.join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf'))
  const measure = createMeasure(font)
  const frame = { measure, maxWidth: 1005, sizes: [64, 56, 48] }

  it.each([
    'Building a bilingual journal with MDX & Next.js step by step',
    'Ein zweisprachiges Journal mit MDX und Next.js bauen, Teil 1',
    'Warum Überstunden und Feierabend in Teams wichtig sind, echt'
  ])('lays out "%s" in at most two lines that fit the frame', title => {
    expect(title).toHaveLength(60)

    const layout = layoutTitle(title, frame)

    expect(layout).not.toBeNull()
    expect(layout!.lines.length).toBeLessThanOrEqual(2)

    for (const line of layout!.lines) expect(measure(line) * layout!.size).toBeLessThanOrEqual(1005)
  })

  it('falls back to normal wrapping when even two lines would overflow', () => {
    expect(layoutTitle('W'.repeat(60), frame)).toBeNull()
    expect(layoutTitle('WHY WE MOVED EVERY MONOREPO WORKSPACE TO PNPM AND NODE 24 NOW', frame)).toBeNull()
  })
})
