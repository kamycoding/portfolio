import { describe, expect, it, vi } from 'vitest'

import {
  CALENDAR_QUERY,
  contributionWindow,
  fetchSnapshot,
  GITHUB_GRAPHQL_URL,
  parseCalendar,
  periodText
} from './contributions'

const NOW = new Date('2026-11-09T03:00:00Z')

const calendar = (days: readonly [date: string, count: number, level: string][]) => ({
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: [
            {
              contributionDays: days.map(([date, contributionCount, contributionLevel]) => ({
                date,
                contributionCount,
                contributionLevel
              }))
            }
          ]
        }
      }
    }
  }
})

const VALID = calendar([
  ['2026-07-19', 7, 'FOURTH_QUARTILE'],
  ['2026-07-20', 2, 'FIRST_QUARTILE'],
  ['2026-08-05', 12, 'FOURTH_QUARTILE'],
  ['2026-11-09', 0, 'NONE']
])

const respond = (body: unknown, status = 200) =>
  vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(body), { status }))

describe('contributionWindow', () => {
  it('ends today and starts on the Monday 16 weeks before the current week', () => {
    expect(contributionWindow(NOW)).toEqual({ start: '2026-07-20', end: '2026-11-09' })
  })

  it('treats Sunday as the last day of the week', () => {
    expect(contributionWindow(new Date('2026-11-15T23:00:00Z'))).toEqual({ start: '2026-07-20', end: '2026-11-15' })
  })
})

describe('parseCalendar', () => {
  it("keeps only the window's days and maps GitHub's levels to 0 to 4", () => {
    expect(parseCalendar(VALID, '2026-07-20', '2026-11-09')).toEqual([
      { date: '2026-07-20', count: 2, level: 1 },
      { date: '2026-08-05', count: 12, level: 4 },
      { date: '2026-11-09', count: 0, level: 0 }
    ])
  })

  it('rejects an unexpected shape', () => {
    expect(() => parseCalendar({ data: { user: null } }, '2026-07-20', '2026-11-09')).toThrow()
  })
})

describe('fetchSnapshot', () => {
  it('builds a snapshot from a valid response', async () => {
    const fetchMock = respond(VALID)

    const result = await fetchSnapshot({ token: 'test-token', now: NOW, fetch: fetchMock })

    expect(result).toEqual({
      ok: true,
      snapshot: {
        user: 'kamycoding',
        start: '2026-07-20',
        end: '2026-11-09',
        fetchedAt: '2026-11-09T03:00:00.000Z',
        days: [
          { date: '2026-07-20', count: 2, level: 1 },
          { date: '2026-08-05', count: 12, level: 4 },
          { date: '2026-11-09', count: 0, level: 0 }
        ]
      }
    })

    const [url, init] = fetchMock.mock.calls[0]
    const body = JSON.parse(String(init?.body))

    expect(url).toBe(GITHUB_GRAPHQL_URL)
    expect(new Headers(init?.headers).get('authorization')).toBe('bearer test-token')
    expect(body).toEqual({
      query: CALENDAR_QUERY,
      variables: { login: 'kamycoding', from: '2026-07-20T00:00:00Z', to: '2026-11-09T23:59:59Z' }
    })
  })

  it('keeps the snapshot without a token and makes no request', async () => {
    const fetchMock = vi.fn<typeof fetch>()

    expect(await fetchSnapshot({ token: undefined, now: NOW, fetch: fetchMock })).toEqual({
      ok: false,
      reason: 'no token'
    })
    expect(await fetchSnapshot({ token: '', now: NOW, fetch: fetchMock })).toEqual({ ok: false, reason: 'no token' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('keeps the snapshot on an HTTP error, such as an expired token', async () => {
    expect(await fetchSnapshot({ token: 't', now: NOW, fetch: respond({}, 401) })).toEqual({
      ok: false,
      reason: 'HTTP 401'
    })
  })

  it('keeps the snapshot when GraphQL reports errors', async () => {
    const result = await fetchSnapshot({ token: 't', now: NOW, fetch: respond({ errors: [{ message: 'x' }] }) })

    expect(result).toEqual({ ok: false, reason: 'GraphQL errors' })
  })

  it('keeps the snapshot on an unexpected shape or an empty calendar', async () => {
    expect(await fetchSnapshot({ token: 't', now: NOW, fetch: respond({ data: { user: null } }) })).toEqual({
      ok: false,
      reason: 'unexpected response shape'
    })
    expect(await fetchSnapshot({ token: 't', now: NOW, fetch: respond(calendar([])) })).toEqual({
      ok: false,
      reason: 'empty calendar'
    })
  })

  it('keeps the snapshot on a network error or a timeout', async () => {
    const network = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('fetch failed'))
    const timeout = vi.fn<typeof fetch>().mockRejectedValue(new DOMException('timed out', 'TimeoutError'))

    expect(await fetchSnapshot({ token: 't', now: NOW, fetch: network })).toEqual({
      ok: false,
      reason: 'network error'
    })
    expect(await fetchSnapshot({ token: 't', now: NOW, fetch: timeout })).toEqual({ ok: false, reason: 'timeout' })
  })

  it('never puts the token into a failure reason', async () => {
    const result = await fetchSnapshot({ token: 'secret-token', now: NOW, fetch: respond({}, 500) })

    expect(JSON.stringify(result)).not.toContain('secret-token')
  })
})

describe('periodText', () => {
  it('names both months and the year in English and German', () => {
    expect(periodText('2026-07-20', '2026-11-09', 'en-GB', 'to')).toBe('Jul to Nov 2026')

    // German short month names differ between ICU versions (Jul, Juli, Nov, Nov.), so only the pattern is fixed.
    expect(periodText('2026-07-20', '2026-11-09', 'de-DE', 'bis')).toMatch(/^Jul\S* bis Nov\S* 2026$/)
  })

  it('names both years when the window crosses New Year', () => {
    expect(periodText('2026-09-14', '2027-01-04', 'en-GB', 'to')).toBe('Sept 2026 to Jan 2027')
  })
})
