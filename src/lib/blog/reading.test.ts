import { describe, expect, it } from 'vitest'

import { getActiveHeading, getReadingProgress, nestOutline } from './reading'

const viewport = { height: 800, top: 84, bottom: 28 }

describe('nestOutline', () => {
  it('nests h3 entries under the preceding h2', () => {
    expect(
      nestOutline([
        { id: 'early', text: 'Early', depth: 3 },
        { id: 'a', text: 'A', depth: 2 },
        { id: 'a-1', text: 'A.1', depth: 3 },
        { id: 'a-2', text: 'A.2', depth: 3 },
        { id: 'b', text: 'B', depth: 2 }
      ])
    ).toEqual([
      { id: 'early', text: 'Early', depth: 3, children: [] },
      {
        id: 'a',
        text: 'A',
        depth: 2,
        children: [
          { id: 'a-1', text: 'A.1', depth: 3 },
          { id: 'a-2', text: 'A.2', depth: 3 }
        ]
      },
      { id: 'b', text: 'B', depth: 2, children: [] }
    ])
  })
})

describe('getActiveHeading', () => {
  it('has no active heading before the first one reaches the line', () => {
    expect(getActiveHeading([300, 900], 92, viewport, false)).toBe(-1)
  })

  it('picks the last heading at or above the line', () => {
    expect(getActiveHeading([-400, 92, 500], 92, viewport, false)).toBe(1)
  })

  it('falls back to the last visible heading once the body end is visible', () => {
    expect(getActiveHeading([-400, 300, 700, 790], 92, viewport, true)).toBe(2)
  })
})

describe('getReadingProgress', () => {
  it('starts at 0 while the body is below the top bar', () => {
    expect(getReadingProgress(400, 3000, viewport)).toBe(0)
  })

  it('reaches 1 when the end of the body is visible above the status bar', () => {
    const visible = viewport.height - viewport.top - viewport.bottom

    expect(getReadingProgress(viewport.top - (3000 - visible), 3000, viewport)).toBe(1)
  })

  it('reports the share in between, rounded to whole percent', () => {
    const scrollable = 3000 - (viewport.height - viewport.top - viewport.bottom)

    expect(getReadingProgress(viewport.top - scrollable / 3, 3000, viewport)).toBe(0.33)
  })

  it('treats a short body as read once it is fully visible', () => {
    expect(getReadingProgress(200, 300, viewport)).toBe(1)
    expect(getReadingProgress(600, 300, viewport)).toBe(0)
  })
})
