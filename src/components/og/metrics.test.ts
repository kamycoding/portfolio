import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { createMeasure } from './metrics'

const font = readFileSync(path.join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf'))
const measure = createMeasure(font)

describe('createMeasure', () => {
  it('reads advance widths in em from the font file', () => {
    expect(measure('W')).toBeGreaterThan(measure('M'))
    expect(measure('M')).toBeGreaterThan(measure('i'))
    expect(measure('i')).toBeGreaterThan(0)
    expect(measure('W')).toBeLessThan(1.2)
  })

  it('adds up the characters of a text, including German letters', () => {
    expect(measure('Größe')).toBeCloseTo(measure('G') + measure('r') + measure('ö') + measure('ß') + measure('e'))
    expect(measure('ö')).toBeGreaterThan(0)
  })

  it('treats a no-break space like a space', () => {
    expect(measure(' ')).toBe(measure(' '))
  })

  it('accepts an ArrayBuffer as well', () => {
    const copy = font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength)

    expect(createMeasure(copy)('Journal')).toBe(measure('Journal'))
  })
})
