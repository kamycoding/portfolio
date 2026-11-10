'use client'

import { useTranslations } from 'next-intl'

import type { PostLanguage } from '@/lib/blog/schema'

import PostLink from './post-link'
import styles from './blog.module.css'

const TranslationNotice = ({
  slug,
  language,
  title
}: Readonly<{ slug: string; language: PostLanguage; title: string }>) => {
  const t = useTranslations('journal')

  return (
    <div className={styles.notice}>
      <h1>{t('missingTitle')}</h1>
      <p>{t('missingDescription', { language: t(`languages.${language}`) })}</p>
      <p lang={language}>{title}</p>
      <PostLink slug={slug} language={language}>
        {t('readIn', { language: t(`languages.${language}`) })}
      </PostLink>
    </div>
  )
}

export default TranslationNotice
