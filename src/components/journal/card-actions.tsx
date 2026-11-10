'use client'

import { useEffect, useState } from 'react'

import { useTranslations } from 'next-intl'

import AudioButton from '@/components/blog/mdx/audio-button'
import PostLink from '@/components/blog/post-link'
import { showToast } from '@/hooks/use-toast'
import type { CardClip } from '@/lib/blog/home'
import type { PostLanguage } from '@/lib/blog/schema'
import { cn } from '@/lib/utils'

import styles from './journal.module.css'

type CardActionsProps = Readonly<{
  slug: string
  lang: PostLanguage
  other: PostLanguage | null
  url: string
  listen: CardClip | null
}>

// The four things a card can do: listen, copy its link, read the other translation, open it.
const CardActions = ({ slug, lang, other, url, listen }: CardActionsProps) => {
  const t = useTranslations('journal')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const timer = window.setTimeout(() => setCopied(false), 2000)

    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      // Without clipboard access (http, old browsers) the address is shown instead.
      showToast(url)
    }
  }

  return (
    <div className={styles.actions}>
      {listen && (
        <AudioButton
          {...listen}
          label={t('home.listen')}
          visible={{ idle: t('home.listen'), playing: t('home.stop') }}
          className={cn(styles.action, styles.listen)}
        />
      )}
      <button type='button' className={cn(styles.action, styles.copy)} onClick={copy}>
        {copied ? t('home.copied') : t('home.copyLink')}
      </button>
      {/* Rendered empty from the start, so screen readers register the live region before the first copy. */}
      <span role='status' className='sr-only'>
        {copied ? t('home.copied') : ''}
      </span>
      {/* The same cookie handling as every other link to a translation in the other language. */}
      {other && (
        <PostLink slug={slug} language={other} className={styles.action}>
          {t('readIn', { language: t(`languages.${other}`) })}
        </PostLink>
      )}
      <span data-open='' className={styles.openWrap}>
        <PostLink slug={slug} language={lang} className={cn(styles.action, styles.open)}>
          {t('home.open')}
          <span aria-hidden='true'> →</span>
        </PostLink>
      </span>
    </div>
  )
}

export default CardActions
