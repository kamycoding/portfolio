// Component Imports
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// Util Imports
import { cn } from '@/lib/utils'

const CONTRIBUTION_LEVEL_STYLES = [
  'bg-background',
  'bg-[#9be9a8] dark:bg-[#0e4429]',
  'bg-[#40c463] dark:bg-[#006d32]',
  'bg-[#30a14e] dark:bg-[#26a641]',
  'bg-[#216e39] dark:bg-[#39d353]'
]

const CONTRIBUTION_LEVEL_COUNTS = [0, 1, 3, 5, 8]

const CONTRIBUTION_ROWS = 6
const CONTRIBUTION_COLUMNS = 39
const TOTAL_CONTRIBUTION_CELLS = CONTRIBUTION_ROWS * CONTRIBUTION_COLUMNS
const LATEST_CONTRIBUTION_DATE = new Date(2026, 8, 20)

// Preview data: real daily commits to kamycoding/portfolio. The final build reads all public repos from the GitHub API.
const COMMITS_BY_DAY: Record<string, number> = {
  '2026-07-23': 1, '2026-07-24': 2, '2026-07-25': 4, '2026-07-26': 4, '2026-07-29': 2, '2026-07-30': 1,
  '2026-08-01': 2, '2026-08-03': 3, '2026-08-04': 9, '2026-08-05': 10, '2026-08-06': 9, '2026-08-07': 4,
  '2026-08-08': 11, '2026-08-09': 24, '2026-08-10': 20, '2026-08-11': 23, '2026-08-12': 6,
  '2026-09-15': 5, '2026-09-17': 20, '2026-09-18': 8
}

const toKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const levelFor = (count: number) => CONTRIBUTION_LEVEL_COUNTS.reduce((lvl, min, i) => (count >= min && min > 0 ? i : lvl), 0)

const buildContributionCell = (rowIndex: number, columnIndex: number) => {
  const chronologicalIndex = columnIndex * CONTRIBUTION_ROWS + rowIndex
  const daysAgo = TOTAL_CONTRIBUTION_CELLS - 1 - chronologicalIndex

  const date = new Date(LATEST_CONTRIBUTION_DATE)

  date.setDate(date.getDate() - daysAgo)
  const count = COMMITS_BY_DAY[toKey(date)] ?? 0

  return { level: levelFor(count), count, date }
}

const CONTRIBUTION_GRID = Array.from({ length: CONTRIBUTION_ROWS }, (_, rowIndex) =>
  Array.from({ length: CONTRIBUTION_COLUMNS }, (_, columnIndex) => buildContributionCell(rowIndex, columnIndex))
)

const STACK = ['angular', 'react', 'nextjs', 'typescript', 'javascript', 'nodejs', 'nestjs', 'postgresql', 'supabase', 'rxjs', 'tailwindcss', 'sass', 'html5', 'css3', 'git', 'github', 'figma', 'vscode', 'python', 'django']

const BRAND_LOGOS = STACK.map(name => ({ src: `/images/k/stack/${name}.svg`, alt: name }))

const LOGO_ROWS = [BRAND_LOGOS.slice(0, 10), BRAND_LOGOS.slice(10)]

const ActivityCard = () => {
  return (
    <Card className='ring-border gap-6 rounded-3xl p-6 shadow-lg'>
      <CardContent className='space-y-4 p-0'>
        <div>
          <p className='text-sm font-semibold'>@kamycoding</p>
          <p className='text-muted-foreground text-xs opacity-75'>168 commits to kamycoding/portfolio in 2026</p>
        </div>

        <div className='overflow-x-auto max-md:pr-6'>
          <div className='space-y-1'>
            {CONTRIBUTION_GRID.map((row, rowIndex) => (
              <div key={rowIndex} className='flex gap-1'>
                {row.map((cell, columnIndex) => {
                  const dateLabel = cell.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

                  return (
                    <Tooltip key={columnIndex}>
                      <TooltipTrigger
                        render={
                          <span
                            className={cn(
                              'size-3.5 rounded-xs transition-transform duration-150 hover:scale-125 max-lg:shrink-0 sm:size-5',
                              CONTRIBUTION_LEVEL_STYLES[cell.level]
                            )}
                          />
                        }
                      />
                      <TooltipContent className='dark:text-primary bg-black font-medium [&>*:last-child]:hidden'>
                        <span className='font-semibold'>
                          {cell.count} contribution{cell.count === 1 ? '' : 's'}
                        </span>{' '}
                        on {dateLabel}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <div className='border-border -mx-6 border-t' />

      <div className='min-w-0 space-y-8'>
        {LOGO_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className='overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]'
          >
            <div
              className={cn(
                'flex w-max animate-[marquee_25s_linear_infinite] gap-8',
                rowIndex % 2 === 1 && 'direction-reverse'
              )}
            >
              {[...row, ...row].map((logo, logoIndex) => (
                <div
                  key={`${logo.src}-${logoIndex}`}
                  className='bg-background flex size-16 shrink-0 items-center justify-center rounded-md'
                >
                  <img src={logo.src} alt={logo.alt} className='size-10 grayscale transition hover:grayscale-0' />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default ActivityCard
