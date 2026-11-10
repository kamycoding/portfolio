import { describe, expect, it } from 'vitest'

import { SCENARIOS, type ScenarioId } from './event-loop-scenarios'

describe.each(Object.keys(SCENARIOS) as ScenarioId[])('scenario %s', id => {
  const { code, frames } = SCENARIOS[id]
  const lines = code.split('\n').length

  it('starts empty and only ever appends to the console', () => {
    expect(frames[0]).toMatchObject({ line: null, stack: [], micro: [], tasks: [], log: [] })

    frames.forEach((frame, index) => {
      if (index > 0) expect(frame.log.slice(0, frames[index - 1].log.length)).toEqual(frames[index - 1].log)
    })
  })

  it('points at real lines and ends with nothing left to run', () => {
    frames.forEach(frame => {
      if (frame.line !== null) expect(frame.line).toBeGreaterThanOrEqual(1)
      if (frame.line !== null) expect(frame.line).toBeLessThanOrEqual(lines)
    })

    expect(frames.at(-1)).toMatchObject({ micro: [], tasks: [] })
  })

  it('describes every step in both languages', () => {
    frames.forEach(frame => {
      expect(frame.note.en.trim()).not.toBe('')
      expect(frame.note.de.trim()).not.toBe('')
    })
  })
})

describe('the logged order', () => {
  it('matches the puzzles in the article', () => {
    expect(SCENARIOS.order.frames.at(-1)!.log).toEqual(['1', '4', '3', '2'])
    expect(SCENARIOS['async-await'].frames.at(-1)!.log).toEqual(['C', 'A', 'D', 'B'])
  })
})
