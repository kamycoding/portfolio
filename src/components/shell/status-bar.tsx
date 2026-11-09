'use client'

import { useSyncExternalStore } from 'react'

import { useTranslations } from 'next-intl'

import ThemeToggle from '@/components/shell/theme-toggle'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { getSection } from '@/lib/sections'

type StatusBarProps = Readonly<{
  branch: string
}>

const cologneTime = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin'
})

const subscribeToClock = (onChange: () => void) => {
  const timer = window.setInterval(onChange, 15_000)

  return () => window.clearInterval(timer)
}

// The server cannot know the visitor's time, so it renders a placeholder and the browser fills it in.
const useCologneTime = () =>
  useSyncExternalStore(
    subscribeToClock,
    () => cologneTime.format(new Date()),
    () => '--:--'
  )

const StatusBar = ({ branch }: StatusBarProps) => {
  const t = useTranslations('status')
  const { activeId, line } = useScrollSpy()
  const time = useCologneTime()

  return (
    <aside
      aria-label={t('label')}
      className='border-hair bg-panel text-muted fixed inset-x-0 bottom-0 z-40 flex h-(--status) items-center gap-4 overflow-hidden border-t px-3 font-mono text-[11.5px] whitespace-nowrap'
    >
      <span>⎇ {branch}</span>
      <span className='text-ok'>✓ {t('build')}</span>
      {activeId && <span className='text-text hidden lg:inline'>{getSection(activeId).file}</span>}

      <div className='ml-auto flex items-center gap-4'>
        <span className='hidden lg:inline'>UTF-8</span>
        <span className='hidden lg:inline'>LF</span>
        <span className='hidden sm:inline'>Ln {line}</span>
        <ThemeToggle variant='status' className='hidden lg:inline' />
        <span>
          {t('city')} <time>{time}</time>
        </span>
      </div>
    </aside>
  )
}

export default StatusBar
