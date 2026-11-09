import { describe, expect, it } from 'vitest'

import type { ContributionSnapshot } from './contributions'

import { buildHeatmap } from './heatmap'

// 17 weeks from Monday 20 July 2026 to Sunday 15 November; the snapshot ends on Monday 9 November.
const SNAPSHOT: ContributionSnapshot = {
  user: 'kamycoding',
  start: '2026-07-20',
  end: '2026-11-09',
  fetchedAt: '2026-11-09T03:00:00.000Z',
  days: [
    { date: '2026-07-20', count: 2, level: 1 },
    { date: '2026-08-03', count: 3, level: 1 },
    { date: '2026-08-04', count: 9, level: 3 },
    { date: '2026-08-05', count: 12, level: 4 },
    { date: '2026-08-06', count: 1, level: 1 },
    { date: '2026-08-08', count: 5, level: 2 },
    { date: '2026-11-09', count: 4, level: 2 }
  ]
}

describe('buildHeatmap', () => {
  const heat = buildHeatmap(SNAPSHOT, 17)

  it('covers 17 full weeks from the Monday the snapshot starts on', () => {
    expect(heat.cells).toHaveLength(17 * 7)
    expect(heat.cells[0].date).toBe('2026-07-20')
    expect(heat.cells.at(-1)?.date).toBe('2026-11-15')
  })

  it("uses GitHub's levels from the snapshot", () => {
    const levels = Object.fromEntries(heat.cells.filter(cell => cell.count > 0).map(cell => [cell.date, cell.level]))

    expect(levels).toEqual({
      '2026-07-20': 1,
      '2026-08-03': 1,
      '2026-08-04': 3,
      '2026-08-05': 4,
      '2026-08-06': 1,
      '2026-08-08': 2,
      '2026-11-09': 2
    })
  })

  it('marks the days after the snapshot end as future and leaves them empty', () => {
    const future = heat.cells.filter(cell => cell.future).map(cell => cell.date)

    expect(future).toEqual(['2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'])
    expect(heat.cells.filter(cell => cell.future).every(cell => cell.count === 0 && cell.level === 0)).toBe(true)
  })

  it('computes total, best day, longest streak and active days', () => {
    expect(heat.total).toBe(36)
    expect(heat.best).toBe(12)
    expect(heat.streak).toBe(4)
    expect(heat.activeDays).toBe(7)
  })

  it('labels the weeks where a month starts', () => {
    const labelled = heat.months.flatMap((date, week) => (date ? [[week, date]] : []))

    expect(labelled).toEqual([
      [0, '2026-07-20'],
      [2, '2026-08-03'],
      [7, '2026-09-07'],
      [11, '2026-10-05'],
      [15, '2026-11-02']
    ])
  })

  it('shows an empty grid for a snapshot without days', () => {
    const empty = buildHeatmap({ ...SNAPSHOT, days: [] }, 17)

    expect([empty.total, empty.best, empty.streak, empty.activeDays]).toEqual([0, 0, 0, 0])
  })
})
