import type { ReactNode } from 'react'

import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { CopyEmailButton, NowClock } from './hero-client-bits'
import HeroEditor from './hero-editor'
import HeroSurface from './hero-surface'
import Ticker from './ticker'
import TypedHeadline from './typed-headline'

import ui from '@/components/ui/ui.module.css'

import styles from './hero.module.css'

const strong = (chunks: ReactNode) => <strong>{chunks}</strong>

// index.tsx in the prototype: left column, editor with terminal, ticker below.
const Hero = async () => {
  const t = await getTranslations('hero')

  return (
    <HeroSurface>
      <div className={styles.hero}>
        <div>
          <p className={cn(styles.comment, 'rv d1')}>{t('comment')}</p>
          <TypedHeadline line1={t('headline.line1')} line2={t('headline.line2')} className='rv d2' />
          <p className={cn(styles.lede, 'rv d3')}>{t.rich('lede', { strong })}</p>

          <div className={cn(styles.ctas, 'rv d4')}>
            <Link href='/#work' className={cn(ui.btn, ui.primary)}>
              <span>{t('cta.work')}</span>
              <span className={ui.key}>G W</span>
            </Link>
            <CopyEmailButton />
            <span aria-hidden='true' className={styles.separator} />
            <a
              href='https://github.com/kamycoding'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
              className={cn(ui.btn, ui.icon)}
            >
              <svg viewBox='0 0 16 16' fill='currentColor' aria-hidden='true'>
                <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z' />
              </svg>
            </a>
            <a
              href='https://www.linkedin.com/in/kamyarzamanfar'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
              className={cn(ui.btn, ui.icon)}
            >
              <svg viewBox='0 0 16 16' fill='currentColor' aria-hidden='true'>
                <path d='M0 1.15C0 .52.52 0 1.17 0h13.66C15.48 0 16 .52 16 1.15v13.7c0 .63-.52 1.15-1.17 1.15H1.17C.52 16 0 15.48 0 14.85V1.15zm4.94 12.24V6.17H2.54v7.22h2.4zM3.74 5.18c.84 0 1.36-.55 1.36-1.25-.02-.71-.52-1.25-1.34-1.25-.82 0-1.36.54-1.36 1.25 0 .7.52 1.25 1.33 1.25h.01zm4.91 8.21V9.36c0-.22.02-.43.08-.59.17-.43.57-.88 1.23-.88.87 0 1.22.66 1.22 1.63v3.87h2.4V9.25c0-2.22-1.18-3.25-2.77-3.25-1.28 0-1.84.7-2.16 1.2v.03h-.02l.02-.03V6.17h-2.4c.03.68 0 7.22 0 7.22h2.4z' />
              </svg>
            </a>
          </div>

          <ul aria-label={t('now.label')} className={cn(styles.now, 'rv d5')}>
            <li className={styles.ok}>
              <span aria-hidden='true' className={styles.pulse} />
              <span>{t('now.open')}</span>
            </li>
            <li>
              <span className={styles.k}>building</span>
              {t('now.building')}
            </li>
            <li>
              <span className={styles.k}>learning</span>
              Django
            </li>
            <li>
              <span className={styles.k}>{t('now.city')}</span>
              <span>
                <NowClock />
              </span>
            </li>
          </ul>

          <Link href='/#work' className={cn(styles.scrollhint, 'rv d6')}>
            <i aria-hidden='true' />
            <span>{t('scroll')}</span>
          </Link>
        </div>

        <HeroEditor />
      </div>

      <Ticker />
    </HeroSurface>
  )
}

export default Hero
