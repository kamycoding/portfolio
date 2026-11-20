import { describe, expect, it } from 'vitest'

import { berlinMidnight } from './dates'

describe('berlinMidnight', () => {
  it('uses +01:00 in winter time', () => {
    expect(berlinMidnight('2026-11-10')).toBe('2026-11-10T00:00:00+01:00')
    expect(berlinMidnight('2026-01-01')).toBe('2026-01-01T00:00:00+01:00')
  })

  it('uses +02:00 in summer time', () => {
    expect(berlinMidnight('2026-07-01')).toBe('2026-07-01T00:00:00+02:00')
  })

  it('keeps the old offset on the day the clocks change, because midnight comes first', () => {
    expect(berlinMidnight('2026-03-29')).toBe('2026-03-29T00:00:00+01:00')
    expect(berlinMidnight('2026-03-30')).toBe('2026-03-30T00:00:00+02:00')
    expect(berlinMidnight('2026-10-25')).toBe('2026-10-25T00:00:00+02:00')
    expect(berlinMidnight('2026-10-26')).toBe('2026-10-26T00:00:00+01:00')
  })

  it('gives a date and time that parses to that midnight', () => {
    expect(new Date(berlinMidnight('2026-07-01')).toISOString()).toBe('2026-06-30T22:00:00.000Z')
  })
})
