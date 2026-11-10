'use client'

import { useCallback, useLayoutEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useLocale } from 'next-intl'

import { usePathname } from '@/i18n/navigation'
import { isJournalRoute, withoutLocalePrefix } from '@/lib/blog/routes'
import { capturePosition, type ReadingPosition, restoreScrollY, type SectionBox } from '@/lib/locale-position'
import { SECTIONS } from '@/lib/sections'
import { localePath } from '@/lib/site'

type SiteLocale = 'en' | 'de'

// Set by the switch, read once by the new page after it has rendered.
let pending: ReadingPosition | null = null

const measureSections = (): SectionBox[] =>
  SECTIONS.flatMap(section => {
    const element = document.getElementById(section.id)

    return element ? [{ id: section.id, top: element.getBoundingClientRect().top + window.scrollY }] : []
  })

// The fixed top bar and ruler cover the top of the viewport; scroll-padding-top holds their height.
const readingAnchor = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0

// One language switch for the EN/DE buttons, the palette, the L key and the terminal's "lang" command.
export const useSwitchLocale = () => {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return useCallback(
    (target?: SiteLocale) => {
      const next: SiteLocale = target ?? (locale === 'en' ? 'de' : 'en')

      if (next === locale) return

      pending = isJournalRoute(pathname)
        ? { kind: 'top' }
        : capturePosition(measureSections(), window.scrollY, readingAnchor())

      // The proxy reads this cookie, so "/" is served in English instead of redirecting to /de (ADR 0004).
      // Session cookie with the same flags as the proxy's, as described in the privacy policy.
      document.cookie = `NEXT_LOCALE=${next}; path=/; SameSite=Lax; Secure`
      router.replace(localePath(next, withoutLocalePrefix(pathname)), { scroll: false })
    },
    [locale, pathname, router]
  )
}

// Runs in the layout: the language switch remounts it, and the position is restored before the first paint.
export const useRestoreLocalePosition = () => {
  const locale = useLocale()

  useLayoutEffect(() => {
    if (!pending) return

    const top = restoreScrollY(pending, measureSections())

    pending = null
    window.scrollTo({ top, behavior: 'instant' })
  }, [locale])
}
