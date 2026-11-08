import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Component Imports
import ProfileAvailabilityCard from '@/components/layout/profile-availability-card'

// Util Imports
import { cn } from '@/lib/utils'

const DIGIT_4 = ['....X', '...XX', '..X.X', '.X..X', 'X...X', 'XXXXX', '....X', '....X']
const DIGIT_0 = ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.']

const SIDE_PADDING = '..'
const DIGIT_GAP = '..'

const DIGIT_ROWS = DIGIT_4.map(
  (row, index) => SIDE_PADDING + row + DIGIT_GAP + DIGIT_0[index] + DIGIT_GAP + DIGIT_4[index] + SIDE_PADDING
)

const EMPTY_ROW = '.'.repeat(DIGIT_ROWS[0].length)

const NOT_FOUND_GRID = [EMPTY_ROW, ...DIGIT_ROWS, EMPTY_ROW].map(row => row.split(''))

const cornerCurveBackground = 'radial-gradient(circle at 100% 100%, transparent 15.5px, var(--card) 16px)'

const NotFound = () => {
  return (
    <div className='relative'>
      <div className='fixed inset-x-0 top-0 z-70 flex justify-center'>
        <a href='/' className='bg-card relative rounded-b-[20px] shadow-lg'>
          <ProfileAvailabilityCard />
          <div
            className='pointer-events-none absolute top-0 -left-4 size-4 scale-x-[-1]'
            style={{ backgroundImage: cornerCurveBackground }}
          />
          <div
            className='pointer-events-none absolute top-0 -right-4 size-4'
            style={{ backgroundImage: cornerCurveBackground }}
          />
        </a>
      </div>
      <div className='bg-border absolute top-[10%] h-px w-full max-lg:hidden'></div>
      <div className='bg-border absolute bottom-[10%] h-px w-full max-lg:hidden'></div>
      <div className='mx-auto flex h-screen w-full max-w-245 flex-col items-center justify-center gap-9 border-x p-6'>
        <Card className='w-full max-w-xl gap-6 rounded-3xl p-6 shadow-lg'>
          <CardHeader className='gap-1 p-0'>
            <p className='text-base font-medium'>@Oooops</p>
            <p className='text-muted-foreground text-sm font-light'>This page took a wrong turn somewhere</p>
          </CardHeader>
          <CardContent className='space-y-1 p-0'>
            {NOT_FOUND_GRID.map((row, rowIndex) => (
              <div key={rowIndex} className='flex gap-1'>
                {row.map((cell, columnIndex) => (
                  <span
                    key={columnIndex}
                    className={cn('size-3.5 rounded-xs sm:size-5', cell === 'X' ? 'bg-accent' : 'bg-background')}
                  />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NotFound
