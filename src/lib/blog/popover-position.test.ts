import { describe, expect, it } from 'vitest'

import { placePopover } from './popover-position'

const viewport = { width: 400, height: 800 }
const popover = { width: 200, height: 100 }

describe('placePopover', () => {
  it('opens below the anchor when it fits', () => {
    expect(placePopover({ top: 100, bottom: 120, left: 50 }, popover, viewport)).toEqual({
      side: 'bottom',
      top: 126,
      left: 50
    })
  })

  it('flips above the anchor near the bottom of the viewport', () => {
    expect(placePopover({ top: 700, bottom: 720, left: 50 }, popover, viewport)).toMatchObject({
      side: 'top',
      top: 594
    })
  })

  it('stays below when neither side fits', () => {
    expect(placePopover({ top: 60, bottom: 80, left: 50 }, { width: 200, height: 760 }, viewport).side).toBe('bottom')
  })

  it('keeps the page gutter on both edges', () => {
    expect(placePopover({ top: 100, bottom: 120, left: 350 }, popover, viewport).left).toBe(184)
    expect(placePopover({ top: 100, bottom: 120, left: 4 }, popover, viewport).left).toBe(16)
    expect(placePopover({ top: 100, bottom: 120, left: 4 }, { width: 380, height: 100 }, viewport).left).toBe(16)
  })
})
