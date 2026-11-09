import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { SECTIONS } from '@/lib/sections'

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

  return (
    <footer className='border-hair border-t pt-20 pb-15'>
      <div className='mx-auto max-w-(--max) px-(--gutter)'>
        {/* Sized for the 14 characters of "kamycoding.com", the prototype's 10-character wordmark was larger. */}
        <p
          aria-hidden='true'
          className='text-[clamp(44px,9.2vw,140px)] leading-[0.85] font-semibold tracking-[-0.06em] whitespace-nowrap text-transparent select-none [-webkit-text-stroke:1px_var(--hair-3)]'
        >
          kamycoding<span className='text-text [-webkit-text-stroke:0]'>.</span>com
        </p>

        <div className='mt-14 grid grid-cols-2 gap-8 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]'>
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

        <div className='border-hair text-faint mt-14 flex flex-wrap justify-between gap-4 border-t pt-5 font-mono text-[11.5px]'>
          <span>© {year} Kamyar Zamanfar</span>
          <span>{t('builtWith')}</span>

          {/* Kept while Zolt-derived config files remain (ADR 0003). */}
          <span>{t('credit')}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
