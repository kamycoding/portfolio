'use client'

import type { ComponentProps, ReactNode } from 'react'

import { useLocale } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { PostLanguage } from '@/lib/blog/schema'
import { localePath } from '@/lib/site'

// Same flags as the proxy's cookie, as described in the privacy policy (ADR 0004).
export const setLocaleCookie = (language: PostLanguage) => {
  document.cookie = `NEXT_LOCALE=${language}; path=/; SameSite=Lax; Secure`
}

type PostLinkProps = Readonly<{
  slug: string
  language: PostLanguage

  // A heading id, to open the article at that heading.
  hash?: string
  className?: string
  children: ReactNode
}> &
  Pick<ComponentProps<'a'>, 'onFocus' | 'onBlur' | 'onPointerEnter' | 'onPointerLeave'>

// Links a post in the language it is published in. English URLs stay free of /en.
const PostLink = ({ slug, language, hash, className, children, ...handlers }: PostLinkProps) => {
  const locale = useLocale()
  const path = `/blog/${slug}${hash ? `#${hash}` : ''}`

  if (language === locale) {
    return (
      <Link href={path} lang={language} className={className} {...handlers}>
        {children}
      </Link>
    )
  }

  // A plain link without prefetch: the cookie must be set before the request, or locale detection redirects back.
  return (
    <a
      href={localePath(language, path)}
      hrefLang={language}
      lang={language}
      className={className}
      onClick={() => setLocaleCookie(language)}
      {...handlers}
    >
      {children}
    </a>
  )
}

export default PostLink
