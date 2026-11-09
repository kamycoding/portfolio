'use client'

import { useTranslations } from 'next-intl'

import LanguageSwitch from '@/components/shell/language-switch'
import ThemeToggle from '@/components/shell/theme-toggle'
import ui from '@/components/ui/ui.module.css'
import { useModKey } from '@/hooks/use-mod-key'
import { openPalette } from '@/hooks/use-palette'
import { useRestoreLocalePosition } from '@/hooks/use-switch-locale'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { Link, usePathname } from '@/i18n/navigation'
import { getPage, SECTIONS } from '@/lib/sections'
import { cn } from '@/lib/utils'

// versionLabel is "v2.1", from package.json (src/lib/version.ts).
type TopBarProps = Readonly<{
  versionLabel: string
}>

const TopBar = ({ versionLabel }: TopBarProps) => {
  const t = useTranslations('nav')
  const tPalette = useTranslations('palette')
  const modKey = useModKey()

  // The top bar lives in the layout that a language switch remounts, so it puts the visitor back in place.
  useRestoreLocalePosition()
  const { activeId, progress } = useScrollSpy()

  // On a legal page its own file is the open tab, so no section tab is active.
  const page = getPage(usePathname())

  return (
    <header className='border-hair bg-bg/84 fixed inset-x-0 top-0 z-40 flex h-(--top) items-stretch border-b backdrop-blur-md'>
      {/* Named by its text plus a hidden ", home", so the visible label is part of the name (WCAG 2.5.3). */}
      <Link
        href='/#index'
        className='border-hair flex flex-none items-center gap-2.5 border-r px-3 font-mono text-sm font-medium sm:px-5'
      >
        <span
          aria-hidden='true'
          className='border-text grid size-5.5 place-items-center rounded-md border-[1.5px] font-mono text-[10.5px] font-semibold tracking-[-0.04em]'
        >
          k/
        </span>
        <span className='max-sm:sr-only'>kamycoding</span>
        <span className='text-faint hidden text-[11.5px] font-normal lg:inline'>{versionLabel}</span>
        <span className='sr-only'>, {t('home')}</span>
      </Link>

      <nav aria-label={t('main')} className='flex min-w-0 flex-1 [scrollbar-width:none] overflow-x-auto'>
        {SECTIONS.map(section => {
          const isActive = !page && section.id === activeId

          return (
            <Link
              key={section.id}
              href={`/#${section.id}`}
              aria-current={isActive ? 'location' : undefined}
              className={cn(
                'border-hair text-muted hover:text-text relative items-center gap-2 border-r px-4.5 font-mono text-[13px] whitespace-nowrap transition-colors',

                // Small screens show only the active file, like a single open tab.
                isActive
                  ? 'bg-panel text-text after:bg-kw flex after:absolute after:inset-x-0 after:top-0 after:h-[1.5px]'
                  : 'hidden lg:flex'
              )}
            >
              <span aria-hidden='true' className={cn('size-1.75 flex-none rounded-[2px]', section.dot)} />
              {section.file}
              <span aria-hidden='true' className={cn('text-faint ml-0.5 text-[11px]', !isActive && 'opacity-0')}>
                ×
              </span>
            </Link>
          )
        })}
        {page && (
          <Link
            href={page.href}
            aria-current='page'
            className='border-hair bg-panel text-text after:bg-kw relative flex items-center gap-2 border-r px-4.5 font-mono text-[13px] whitespace-nowrap after:absolute after:inset-x-0 after:top-0 after:h-[1.5px]'
          >
            <span aria-hidden='true' className='bg-prop size-1.75 flex-none rounded-[2px]' />
            {page.file}
            <span aria-hidden='true' className='text-faint ml-0.5 text-[11px]'>
              ×
            </span>
          </Link>
        )}
      </nav>

      <div className='border-hair flex flex-none items-center gap-1.5 border-l px-2 sm:gap-2 sm:px-3.5'>
        <button type='button' className={ui.chip} aria-keyshortcuts='Control+K Meta+K' onClick={openPalette}>
          <span className='sr-only'>{tPalette('open')}, </span>
          <span>{modKey}</span> K
        </button>
        <ThemeToggle variant='icon' />
        <LanguageSwitch />
      </div>

      <div
        aria-hidden='true'
        className='bg-kw absolute -bottom-px left-0 h-px transition-[width] duration-100 ease-linear'
        style={{ width: `${progress * 100}%` }}
      />
    </header>
  )
}

export default TopBar
