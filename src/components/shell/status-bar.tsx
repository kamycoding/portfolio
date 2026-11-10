'use client'

import { useLocale, useTranslations } from 'next-intl'

import ThemeToggle from '@/components/shell/theme-toggle'
import { useArticleProgress } from '@/hooks/use-article-progress'
import { useCat, wakeCat } from '@/hooks/use-cat'
import { useCologneTime } from '@/hooks/use-cologne-time'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { usePathname } from '@/i18n/navigation'
import { isJournalRoute, journalFile } from '@/lib/blog/routes'
import { getPage, getSection } from '@/lib/sections'

type StatusBarProps = Readonly<{
  branch: string
}>

const StatusBar = ({ branch }: StatusBarProps) => {
  const t = useTranslations('status')
  const tCat = useTranslations('cat')
  const locale = useLocale()
  const { awake } = useCat()
  const { activeId, line } = useScrollSpy()
  const article = useArticleProgress()
  const time = useCologneTime()
  const pathname = usePathname()

  const file = isJournalRoute(pathname)
    ? journalFile(pathname, locale === 'de' ? 'de' : 'en')
    : (getPage(pathname)?.file ?? (activeId && getSection(activeId).file))

  return (
    <aside
      aria-label={t('label')}
      className='border-hair bg-panel text-muted fixed inset-x-0 bottom-0 z-40 flex h-(--status) items-center gap-4 overflow-hidden border-t px-3 font-mono text-[11.5px] whitespace-nowrap'
    >
      <span>⎇ {branch}</span>
      <span className='text-ok'>✓ {t('build')}</span>
      {file && <span className='text-text hidden lg:inline'>{file}</span>}

      {/*
       * Plain text, not a live region: progress is there to glance at, not announced on every scroll.
       * Last in the left-aligned group, so appearing after hydration and growing never moves anything else.
       */}
      {article.tracking && <span>{t('reading', { progress: article.progress })}</span>}

      <div className='ml-auto flex items-center gap-4'>
        <span className='hidden lg:inline'>UTF-8</span>
        <span className='hidden lg:inline'>LF</span>
        <span className='hidden sm:inline'>Ln {line}</span>
        <ThemeToggle variant='status' className='hidden lg:inline' />
        <button type='button' onClick={wakeCat} className='hover:text-text hidden lg:inline'>
          <span className='sr-only'>{awake ? tCat('awakeLabel') : tCat('wake')}, </span>
          cat: <span className='text-text'>{awake ? tCat('awake') : tCat('asleep')}</span>
        </button>
        <span>
          {t('city')} <time>{time}</time>
        </span>
      </div>
    </aside>
  )
}

export default StatusBar
