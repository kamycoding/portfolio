'use client'

import type { ReactNode } from 'react'

import { useLocale } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { PostLanguage } from '@/lib/blog/schema'
import { localePath } from '@/lib/site'

// Same flags as the proxy's cookie, as described in the privacy policy (ADR 0004).
export const setLocaleCookie = (language: PostLanguage) => {
  document.cookie = `NEXT_LOCALE=${language}; path=/; SameSite=Lax; Secure`
}

type PostLinkProps = Readonly<{ slug: string; language: PostLanguage; className?: string; children: ReactNode }>

// Links a post in the language it is published in. English URLs stay free of /en.
const PostLink = ({ slug, language, className, children }: PostLinkProps) => {
  const locale = useLocale()

  if (language === locale) {
    return (
      <Link href={`/blog/${slug}`} lang={language} className={className}>
        {children}
      </Link>
    )
  }

  // A plain link without prefetch: the cookie must be set before the request, or locale detection redirects back.
  return (
    <a
      href={localePath(language, `/blog/${slug}`)}
      hrefLang={language}
      lang={language}
      className={className}
      onClick={() => setLocaleCookie(language)}
    >
      {children}
    </a>
  )
}

export default PostLink
