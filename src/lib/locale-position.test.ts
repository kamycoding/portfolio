import { describe, expect, it } from 'vitest'

import { capturePosition, restoreScrollY, type SectionBox } from './locale-position'

// English page: fixed bars of 78px, sections stacked.
const EN: SectionBox[] = [
  { id: 'index', top: 0 },
  { id: 'work', top: 900 },
  { id: 'about', top: 2100 },
  { id: 'stack', top: 3900 },
  { id: 'contact', top: 5200 }
]

// The German page is longer, so every section starts further down.
const DE: SectionBox[] = [
  { id: 'index', top: 0 },
  { id: 'work', top: 960 },
  { id: 'about', top: 2250 },
  { id: 'stack', top: 4150 },
  { id: 'contact', top: 5500 }
]

const ANCHOR = 78

describe('capturePosition', () => {
  it('keeps the very top as the top, even with a stale #contact hash in the URL', () => {
    expect(capturePosition(EN, 0, ANCHOR)).toEqual({ kind: 'top' })
    expect(capturePosition(EN, 3, ANCHOR)).toEqual({ kind: 'top' })
  })

  it('stores the offset inside the section under the top bar', () => {
    expect(capturePosition(EN, 2400, ANCHOR)).toEqual({ kind: 'section', id: 'about', offset: 300 })
  })

  it('counts a section whose top is just under the fixed bars', () => {
    expect(capturePosition(EN, 2100 - ANCHOR, ANCHOR)).toEqual({ kind: 'section', id: 'about', offset: -78 })
  })

  it('stays in the hero when scrolled a little', () => {
    expect(capturePosition(EN, 200, ANCHOR)).toEqual({ kind: 'section', id: 'index', offset: 200 })
  })

  it('works right after load, before the page has any sections measured', () => {
    expect(capturePosition([], 0, ANCHOR)).toEqual({ kind: 'top' })
    expect(capturePosition([], 640, ANCHOR)).toEqual({ kind: 'y', y: 640 })
  })

  it('uses the real scroll position during the intro (the overlay does not move the page)', () => {
    expect(capturePosition(EN, 0, ANCHOR)).toEqual({ kind: 'top' })
    expect(capturePosition(EN, 5300, ANCHOR)).toEqual({ kind: 'section', id: 'contact', offset: 100 })
  })
})

describe('restoreScrollY', () => {
  it('returns to the top', () => {
    expect(restoreScrollY({ kind: 'top' }, DE)).toBe(0)
  })

  it('lands at the same offset inside the same section of the other language', () => {
    expect(restoreScrollY(capturePosition(EN, 2400, ANCHOR), DE)).toBe(2550)
  })

  it('round-trips EN to DE and back to the same place', () => {
    const inGerman = restoreScrollY(capturePosition(EN, 4000, ANCHOR), DE)

    expect(restoreScrollY(capturePosition(DE, inGerman, ANCHOR), EN)).toBe(4000)
  })

  it('falls back to the top when the section does not exist on the new page', () => {
    expect(restoreScrollY({ kind: 'section', id: 'work', offset: 50 }, [])).toBe(0)
  })

  it('keeps a plain scroll position when no section was found', () => {
    expect(restoreScrollY({ kind: 'y', y: 640 }, DE)).toBe(640)
  })
})
