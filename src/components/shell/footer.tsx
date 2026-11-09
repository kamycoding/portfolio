import { getLocale, getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { SECTIONS } from '@/lib/sections'
import { buildInfo } from '@/lib/version'

import Wordmark from './wordmark'

const ELSEWHERE = [
  { label: 'GitHub', href: 'https://github.com/kamycoding' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kamyarzamanfar' },
  { label: 'Email', href: 'mailto:contact@kamycoding.com' }
] as const

const headingClass = 'text-com mb-3.5 font-mono text-xs font-normal'
const linkClass = 'text-muted hover:text-text text-[14.5px] transition-colors'

const Footer = async () => {
  const t = await getTranslations('footer')
  const year = new Date().getFullYear()
  const build = buildInfo()

  // UTC like the build date itself, so the day does not shift with the server's time zone.
  const builtOn = new Intl.DateTimeFormat((await getLocale()) === 'de' ? 'de-DE' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(Date.parse(build.date))

  return (
    <footer className='border-hair border-t pt-20 pb-15'>
      <div className='mx-auto max-w-(--max) px-(--gutter)'>
        <div className='grid grid-cols-2 gap-8 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]'>
          <div className='col-span-2 lg:col-span-1'>
            <h2 className={headingClass}>{t('aboutHeading')}</h2>
            <p className='text-muted max-w-[34ch] text-[14.5px] leading-[1.65]'>{t('about')}</p>
          </div>

          <div>
            <h2 className={headingClass}>{t('pages')}</h2>
            <ul className='grid gap-2.5 text-[14.5px]'>
              {SECTIONS.filter(section => section.id !== 'index').map(section => (
                <li key={section.id}>
                  <Link href={`/#${section.id}`} className={linkClass}>
                    {section.file}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>{t('elsewhere')}</h2>
            <ul className='grid gap-2.5 text-[14.5px]'>
              {ELSEWHERE.map(item => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={linkClass}
                    {...(item.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {item.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>{t('legal')}</h2>
            <ul className='grid gap-2.5 text-[14.5px]'>
              <li>
                <Link href='/legal-notice' className={linkClass}>
                  {t('legalNotice')}
                </Link>
              </li>
              <li>
                <Link href='/privacy-policy' className={linkClass}>
                  {t('privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-16 sm:mt-20'>
          <Wordmark />
        </div>

        <div className='border-hair text-faint mt-12 flex flex-wrap justify-between gap-4 border-t pt-5 font-mono text-[11.5px]'>
          <span>© {year} Kamyar Zamanfar</span>
          <span>{t('builtWith')}</span>

          {/* Kept while Zolt-derived config files remain (ADR 0003). */}
          <span>{t('credit')}</span>
        </div>

        {/* The last line of the page, like the end of a file; the values are fixed at build time. */}
        <p className='text-com mt-3 flex flex-wrap gap-x-2 font-mono text-[11.5px]'>
          <span>{'// EOF'}</span>
          <span>· {build.commit}</span>
          <span>· {build.version}</span>
          <span>· {t('build', { date: builtOn })}</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
