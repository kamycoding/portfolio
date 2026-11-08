'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Image from 'next/image'

// Third-party Imports

// Component Imports
import { Card } from '@/components/ui/card'

// Util Imports
import { cn } from '@/lib/utils'

const EQ_BAR_DELAYS = ['[animation-delay:0ms]', '[animation-delay:150ms]', '[animation-delay:300ms]']

const MusicPlayerCard = () => {
  const [expanded, setExpanded] = useState(true)

  return (
    <Card
      onClick={() => setExpanded(prev => !prev)}
      className='ring-border relative cursor-pointer gap-0 overflow-hidden rounded-[24px] bg-(--background-darker) p-0 shadow-none'
    >
      <div
        className={cn(
          'relative overflow-hidden transition-all duration-500',
          expanded
            ? 'h-32 rounded-[0_0_50%_50%/0_0_70%_70%]'
            : 'h-full rounded-b-[16px] max-lg:min-h-80 max-md:min-h-55'
        )}
      >
        <Image
          src='/images/k/heldio-card.webp'
          alt='Heldio dashboard'
          fill
          sizes='auto'
          className='object-cover object-bottom'
        />
      </div>
      <div
        className={cn(
          'absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-500',
          expanded ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className='ring-background/40 relative size-8 overflow-hidden rounded-full ring-2'>
          <Image src='/images/k/logo-heldio.webp' alt='Heldio logo' fill sizes='auto' className='object-cover' />
        </div>
      </div>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-500',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className='overflow-hidden'>
          <div
            className={cn(
              'space-y-1.5 px-4 py-4 text-center transition-all duration-3000',
              expanded ? 'opacity-100 blur-none' : 'opacity-0 blur-lg'
            )}
          >
            <span className='text-muted-foreground mx-auto flex h-3 w-fit items-center gap-0.5'>
              {EQ_BAR_DELAYS.map((delay, bar) => (
                <span
                  key={bar}
                  className={cn(
                    'h-full w-0.5 origin-center animate-[eq_0.9s_ease-in-out_infinite] rounded-full bg-current',
                    delay
                  )}
                />
              ))}
            </span>
            <p className='text-muted-foreground text-xs'>Now building</p>
            <p className='text-sm font-medium'>Heldio MVP</p>
            <div className='bg-muted mx-auto h-px w-6' />
            <p className='text-muted-foreground font-mono text-xs tabular-nums'>
              goal, plan, practice, feedback
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MusicPlayerCard
