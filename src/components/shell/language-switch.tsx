'use client'

import { useLocale, useTranslations } from 'next-intl'

import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const LanguageSwitch = () => {
  const t = useTranslations('language')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchTo = (next: (typeof routing.locales)[number]) => {
    if (next === locale) return

    // Keep the current section (#work, #about, ...) when switching the language.
    router.replace(`${pathname}${window.location.hash}`, { locale: next })
  }

  return (
    <div
      role='group'
      aria-label={t('label')}
      className='border-hair-2 inline-flex h-7.5 overflow-hidden rounded-[7px] border'
    >
      {routing.locales.map(code => (
        <button
          key={code}
          type='button'
          lang={code}
          aria-pressed={code === locale}
          onClick={() => switchTo(code)}
          className='text-muted aria-pressed:bg-text aria-pressed:text-bg px-1.75 font-mono text-[11.5px] font-medium transition-colors sm:px-2.25'
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitch
