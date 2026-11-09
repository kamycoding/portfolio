export type HeatLevel = 0 | 1 | 2 | 3 | 4

export type HeatCell = Readonly<{
  date: string
  count: number
  level: HeatLevel
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

// Thresholds from the prototype (app.js renderHeat).
export const heatLevel = (count: number): HeatLevel => {
  if (count === 0) return 0
  if (count < 4) return 1
  if (count < 9) return 2
  if (count < 16) return 3

  return 4
}

// Days run down the columns, weeks across. UTC math keeps daylight saving time out of the dates.
export const buildHeatmap = (commits: Readonly<Record<string, number>>, start: string, weeks: number): Heatmap => {
  const origin = Date.parse(`${start}T00:00:00Z`)
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
      const count = commits[date] ?? 0

      total += count
      best = Math.max(best, count)

      if (count > 0) {
        activeDays++
        run++
        streak = Math.max(streak, run)
      } else {
        run = 0
      }

      // A month label goes on the first week that starts inside that month.
      if (day === 0 && (week === 0 || time.getUTCDate() <= 7)) months[week] = date

      cells.push({ date, count, level: heatLevel(count) })
    }
  }

  return { cells, months, total, best, streak, activeDays }
}
