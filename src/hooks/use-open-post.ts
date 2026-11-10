'use client'

import { useCallback } from 'react'

import { useLocale } from 'next-intl'

import { setLocaleCookie } from '@/components/blog/post-link'
import { useRouter } from '@/i18n/navigation'
import type { PostEntry } from '@/lib/blog/home'
import { localePath } from '@/lib/site'

// Opens a post from the terminal or the palette like PostLink does: a post in the other language needs the locale
// cookie and a full navigation, or locale detection redirects back (ADR 0004).
export const useOpenPost = () => {
  const locale = useLocale()
  const router = useRouter()

  return useCallback(
    ({ slug, lang }: Pick<PostEntry, 'slug' | 'lang'>) => {
      if (lang === locale) return router.push(`/blog/${slug}`)

      setLocaleCookie(lang)
      window.location.assign(localePath(lang, `/blog/${slug}`))
    },
    [locale, router]
  )
}
