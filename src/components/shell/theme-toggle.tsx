'use client'

import { useSyncExternalStore } from 'react'

import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'

type ThemeToggleProps = Readonly<{
  variant: 'icon' | 'status'
  className?: string
}>

const subscribeNothing = () => () => {}

// The theme is only known in the browser, so labels wait for the client to avoid a hydration mismatch.
const useIsClient = () =>
  useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  )

const ThemeToggle = ({ variant, className }: ThemeToggleProps) => {
  const t = useTranslations('theme')
  const { resolvedTheme, setTheme } = useTheme()
  const isClient = useIsClient()
  const current = resolvedTheme === 'light' ? 'light' : 'dark'

  const toggle = () => setTheme(current === 'dark' ? 'light' : 'dark')

  // Named by hidden text plus the visible theme, so the visible label is part of the name (WCAG 2.5.3).
  if (variant === 'status') {
    return (
      <button type='button' onClick={toggle} className={cn('hover:text-text', className)}>
        <span className='sr-only'>{t('toggle')}: </span>
        <span aria-hidden='true'>◐ </span>
        <span>{isClient ? t(current) : ' '}</span>
      </button>
    )
  }

  return (
    <button
      type='button'
      onClick={toggle}
      aria-label={t('toggle')}
      className={cn(
        'border-hair-2 text-muted hover:border-hair-3 hover:text-text inline-flex h-7.5 min-w-7.5 items-center justify-center rounded-[7px] border px-2.25 transition-colors',
        className
      )}
    >
      <svg
        viewBox='0 0 16 16'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.4'
        strokeLinecap='round'
        aria-hidden='true'
        className='size-3.5'
      >
        <circle cx='8' cy='8' r='3.2' />
        <path d='M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1' />
      </svg>
    </button>
  )
}

export default ThemeToggle
