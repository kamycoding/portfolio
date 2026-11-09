import { describe, expect, it } from 'vitest'

import { COMMITS_BY_DAY, HEAT_START, HEAT_WEEKS } from '../content/activity'

import { buildHeatmap, heatLevel } from './heatmap'

describe('heatLevel', () => {
  it('maps counts to the prototype thresholds', () => {
    expect([0, 1, 3, 4, 8, 9, 15, 16, 24].map(heatLevel)).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4])
  })
})

describe('buildHeatmap', () => {
  const heat = buildHeatmap(COMMITS_BY_DAY, HEAT_START, HEAT_WEEKS)

  it('covers 17 full weeks from Monday 1 June', () => {
    expect(heat.cells).toHaveLength(17 * 7)
    expect(heat.cells[0].date).toBe('2026-06-01')
    expect(heat.cells.at(-1)?.date).toBe('2026-09-27')
  })

  it('counts every commit of the v1 history', () => {
    expect(heat.total).toBe(168)
    expect(heat.best).toBe(24)
    expect(heat.activeDays).toBe(20)
  })

  it('finds the longest run of active days (3 to 12 August)', () => {
    expect(heat.streak).toBe(10)
  })

  it('labels the weeks where a month starts', () => {
    const labelled = heat.months.flatMap((date, week) => (date ? [[week, date]] : []))

    expect(labelled).toEqual([
      [0, '2026-06-01'],
      [5, '2026-07-06'],
      [9, '2026-08-03'],
      [14, '2026-09-07']
    ])
  })

  it('places a day in its week column and weekday row', () => {
    const index = heat.cells.findIndex(cell => cell.date === '2026-08-09')

    // Sunday of the tenth week.
    expect(index).toBe(9 * 7 + 6)
    expect(heat.cells[index]).toEqual({ date: '2026-08-09', count: 24, level: 4 })
  })
})
