'use client'

import * as React from 'react'

import { useTheme } from 'next-themes'

// SVG Imports
import SunIcon from '@/assets/svg/sun'
import MoonIcon from '@/assets/svg/moon'

import { cn } from '@/lib/utils'

function ModeToggle({ className, children, ...props }: React.ComponentProps<'button'>) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type='button'
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
      className={cn('flex items-center', className)}
      {...props}
    >
      <span className='relative flex size-4 shrink-0 items-center justify-center'>
        <MoonIcon className='size-4 scale-100 dark:scale-0' />
        <SunIcon className='absolute size-4 scale-0 dark:scale-100' />
      </span>
      {children}
      <span className='sr-only'>Toggle theme</span>
    </button>
  )
}

export { ModeToggle }
