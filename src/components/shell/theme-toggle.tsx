'use client'

import { useSyncExternalStore } from 'react'

import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { openThemePicker } from '@/hooks/use-palette'
import { getTheme } from '@/lib/themes'
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

// Opens the Color Theme picker (also on T), with the current theme preselected.
const ThemeToggle = ({ variant, className }: ThemeToggleProps) => {
  const t = useTranslations('theme')
  const { resolvedTheme } = useTheme()
  const isClient = useIsClient()

  // Named by hidden text plus the visible theme, so the visible label is part of the name (WCAG 2.5.3).
  if (variant === 'status') {
    return (
      <button
        type='button'
        aria-haspopup='dialog'
        aria-keyshortcuts='T'
        onClick={openThemePicker}
        className={cn('hover:text-text', className)}
      >
        <span className='sr-only'>{t('picker')}: </span>
        <span aria-hidden='true'>◐ </span>
        <span>{isClient ? getTheme(resolvedTheme).name : ' '}</span>
      </button>
    )
  }

  return (
    <button
      type='button'
      aria-haspopup='dialog'
      aria-keyshortcuts='T'
      onClick={openThemePicker}
      aria-label={t('picker')}
      className={cn(
        'border-hair-2 text-muted hover:border-hair-3 hover:text-text inline-flex h-7.5 min-w-7.5 items-center justify-center rounded-[7px] border px-2.25 transition-colors',
        className
      )}
    >
      {/* A painter's palette, the icon VS Code uses for color themes. */}
      <svg
        viewBox='0 0 16 16'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.3'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
        className='size-3.5'
      >
        <path d='M8 1.8a6.2 6.2 0 1 0 0 12.4c1 0 1.5-.6 1.5-1.3 0-.9-.8-1.2-.8-2 0-.7.6-1.2 1.4-1.2h1.7a2.4 2.4 0 0 0 2.4-2.4C14.2 4.3 11.4 1.8 8 1.8Z' />
        <circle cx='4.9' cy='7.4' r='.9' fill='currentColor' stroke='none' />
        <circle cx='6.9' cy='4.6' r='.9' fill='currentColor' stroke='none' />
        <circle cx='10.1' cy='4.8' r='.9' fill='currentColor' stroke='none' />
      </svg>
    </button>
  )
}

export default ThemeToggle
