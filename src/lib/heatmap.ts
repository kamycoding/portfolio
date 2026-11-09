import { type ContributionLevel, type ContributionSnapshot, firstMonday } from './contributions'

export type HeatCell = Readonly<{
  date: string
  count: number
  level: ContributionLevel

  // Days after the snapshot's end (the rest of the current week) stay empty, like on GitHub.
  future: boolean
}>

export type Heatmap = Readonly<{
  cells: readonly HeatCell[]

  // Per week: the ISO date that starts a month label there, or null.
  months: readonly (string | null)[]
  total: number
  best: number
  streak: number
  activeDays: number
}>

const DAY_MS = 86_400_000

// Days run down the columns (Monday first), weeks across. UTC math keeps daylight saving time out of the dates.
// The grid counts back from `end`, so a snapshot with a shorter range still fills the right weeks.
export const buildHeatmap = (snapshot: ContributionSnapshot, weeks: number): Heatmap => {
  const byDate = new Map(snapshot.days.map(day => [day.date, day]))
  const origin = firstMonday(Date.parse(`${snapshot.end}T00:00:00Z`), weeks)
  const cells: HeatCell[] = []
  const months: (string | null)[] = []
  let total = 0
  let best = 0
  let streak = 0
  let run = 0
  let activeDays = 0

  for (let week = 0; week < weeks; week++) {
    months.push(null)

    for (let day = 0; day < 7; day++) {
      const time = new Date(origin + (week * 7 + day) * DAY_MS)
      const date = time.toISOString().slice(0, 10)
      const future = date > snapshot.end
      const entry = byDate.get(date)
      const count = future ? 0 : (entry?.count ?? 0)

      total += count
      best = Math.max(best, count)

      if (count > 0) {
        activeDays++
        run++
        streak = Math.max(streak, run)
      } else if (!future) {
        run = 0
      }

      // A month label goes on the first week that starts inside that month. The last column has no room for one.
      if (day === 0 && week > 0 && week < weeks - 1 && time.getUTCDate() <= 7) months[week] = date

      cells.push({ date, count, level: future ? 0 : (entry?.level ?? 0), future })
    }
  }

  // The first week names its month unless the next week starts a new one, so two labels never collide.
  if (weeks > 1 && !months[1]) months[0] = cells[0].date

  return { cells, months, total, best, streak, activeDays }
}
