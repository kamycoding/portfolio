'use client'

import { useTranslations } from 'next-intl'

import type { PostLanguage } from '@/lib/blog/schema'
import { localePath } from '@/lib/site'

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
      <a
        href={localePath(language, `/blog/${slug}`)}
        lang={language}
        onClick={() => {
          // Let locale detection honour the link without an /en URL or a redirect back to this notice.
          document.cookie = `NEXT_LOCALE=${language}; path=/; SameSite=Lax; Secure`
        }}
      >
        {t('readIn', { language: t(`languages.${language}`) })}
      </a>
    </div>
  )
}

export default TranslationNotice
