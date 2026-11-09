import { describe, expect, it } from 'vitest'

import { getActiveIndex, getLineNumber, getProgress } from './scroll-spy'

describe('getActiveIndex', () => {
  const viewport = 1000

  it('keeps the first section active at the top of the page', () => {
    expect(getActiveIndex([0, 900, 1800], viewport)).toBe(0)
  })

  it('switches once a section top passes 40% of the viewport', () => {
    expect(getActiveIndex([-500, 401, 1300], viewport)).toBe(0)
    expect(getActiveIndex([-500, 399, 1300], viewport)).toBe(1)
  })

  it('picks the last section that passed the line at the bottom of the page', () => {
    expect(getActiveIndex([-3000, -2000, -900, 100], viewport)).toBe(3)
  })

  it('falls back to the first section when there are none', () => {
    expect(getActiveIndex([], viewport)).toBe(0)
  })
})

describe('getLineNumber', () => {
  it('starts at line 1', () => {
    expect(getLineNumber(0)).toBe(1)
  })

  it('adds one line per 24px of scroll', () => {
    expect(getLineNumber(240)).toBe(11)
  })

  it('ignores negative overscroll', () => {
    expect(getLineNumber(-50)).toBe(1)
  })
})

describe('getProgress', () => {
  it('returns a value between 0 and 1', () => {
    expect(getProgress(0, 2000)).toBe(0)
    expect(getProgress(1000, 2000)).toBe(0.5)
    expect(getProgress(2500, 2000)).toBe(1)
  })

  it('returns 0 when the page cannot scroll', () => {
    expect(getProgress(0, 0)).toBe(0)
  })
})
