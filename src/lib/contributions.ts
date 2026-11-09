import { z } from 'zod'

// GitHub contributions for the stack heatmap, fetched at build time (docs/adr/0006-github-contributions-at-build-time.md).
// Imported by the build script with Node's type stripping, so relative imports only and no TypeScript-only syntax.

export const GITHUB_USER = 'kamycoding'
export const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'
export const WEEKS = 52
export const FETCH_TIMEOUT_MS = 10_000

const DAY_MS = 86_400_000

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export type ContributionDay = Readonly<{ date: string; count: number; level: ContributionLevel }>

export type ContributionSnapshot = Readonly<{
  user: string
  start: string
  end: string
  fetchedAt: string
  days: readonly ContributionDay[]
}>

const isoDate = (time: number) => new Date(time).toISOString().slice(0, 10)

// Monday of the first of `weeks` Monday-first columns, the last column holding `end` (UTC midnight).
export const firstMonday = (end: number, weeks: number) =>
  end - (((new Date(end).getUTCDay() + 6) % 7) + (weeks - 1) * 7) * DAY_MS

// 52 weeks ending the current week: at most 364 days, inside GitHub's one-year limit per query.
// `end` is today, so later days stay empty.
export const contributionWindow = (now: Date) => {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())

  return { start: isoDate(firstMonday(today, WEEKS)), end: isoDate(today) }
}

export const CALENDAR_QUERY = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`

// GitHub's own quartile levels, so the colours match the profile graph.
const LEVEL: Readonly<Record<string, ContributionLevel>> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4
}

const calendarResponse = z.object({
  data: z.object({
    user: z.object({
      contributionsCollection: z.object({
        contributionCalendar: z.object({
          weeks: z.array(
            z.object({
              contributionDays: z.array(
                z.object({
                  date: z.iso.date(),
                  contributionCount: z.number().int().nonnegative(),
                  contributionLevel: z.enum([
                    'NONE',
                    'FIRST_QUARTILE',
                    'SECOND_QUARTILE',
                    'THIRD_QUARTILE',
                    'FOURTH_QUARTILE'
                  ])
                })
              )
            })
          )
        })
      })
    })
  })
})

// Only the days inside the window, sorted, in the snapshot's compact form.
export const parseCalendar = (json: unknown, start: string, end: string): ContributionDay[] =>
  calendarResponse
    .parse(json)
    .data.user.contributionsCollection.contributionCalendar.weeks.flatMap(week => week.contributionDays)
    .filter(day => day.date >= start && day.date <= end)
    .map(day => ({ date: day.date, count: day.contributionCount, level: LEVEL[day.contributionLevel] }))
    .sort((a, b) => a.date.localeCompare(b.date))

type FetchSnapshotInput = Readonly<{
  token: string | undefined
  now: Date
  fetch: typeof globalThis.fetch
}>

export type FetchResult =
  Readonly<{ ok: true; snapshot: ContributionSnapshot }> | Readonly<{ ok: false; reason: string }>

// Never throws: every failure becomes a reason, and the build keeps the committed snapshot.
export const fetchSnapshot = async ({ token, now, fetch }: FetchSnapshotInput): Promise<FetchResult> => {
  if (!token) return { ok: false, reason: 'no token' }

  const { start, end } = contributionWindow(now)

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        authorization: `bearer ${token}`,
        'content-type': 'application/json',
        'user-agent': 'kamycoding.com build'
      },
      body: JSON.stringify({
        query: CALENDAR_QUERY,
        variables: { login: GITHUB_USER, from: `${start}T00:00:00Z`, to: `${end}T23:59:59Z` }
      }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    })

    if (!response.ok) return { ok: false, reason: `HTTP ${response.status}` }

    const json: unknown = await response.json()

    if (typeof json === 'object' && json !== null && 'errors' in json) return { ok: false, reason: 'GraphQL errors' }

    const days = parseCalendar(json, start, end)

    if (days.length === 0) return { ok: false, reason: 'empty calendar' }

    return { ok: true, snapshot: { user: GITHUB_USER, start, end, fetchedAt: now.toISOString(), days } }
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      return { ok: false, reason: 'timeout' }
    }

    return { ok: false, reason: error instanceof z.ZodError ? 'unexpected response shape' : 'network error' }
  }
}

// "Jul to Nov 2026", or "Dec 2026 to Mar 2027" across a year; `to` is the localized word between the months.
export const periodText = (start: string, end: string, locale: string, to: string) => {
  const month = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' })
  const year = (date: string) => date.slice(0, 4)
  const first = month.format(Date.parse(start))
  const last = month.format(Date.parse(end))

  return year(start) === year(end)
    ? `${first} ${to} ${last} ${year(end)}`
    : `${first} ${year(start)} ${to} ${last} ${year(end)}`
}
