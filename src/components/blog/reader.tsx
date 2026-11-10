import type { ReactNode } from 'react'

import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import type { PostLanguage } from '@/lib/blog/schema'

import styles from './blog.module.css'

const Reader = async ({
  locale,
  slug,
  children
}: Readonly<{ locale: PostLanguage; slug?: string; children: ReactNode }>) => {
  const t = await getTranslations({ locale, namespace: 'journal' })
  const file = slug ? `${locale}.mdx` : 'blog/'

  // data-reading switches the shell to its reading cursor and quieter rulers (hooks/use-reading-route.ts).
  return (
    <section className={styles.editor} aria-label={t('editor')} data-reading=''>
      <nav className={styles.tabs} aria-label={t('files')}>
        <Link href='/blog' aria-current={slug ? undefined : 'page'} className={styles.tab}>
          blog/
        </Link>
        {slug && (
          <span className={styles.tab} aria-current='page'>
            {file}
          </span>
        )}
      </nav>
      <nav className={styles.breadcrumb} aria-label={t('breadcrumb')}>
        <span>content</span>
        <span aria-hidden='true'>›</span>
        {slug ? (
          <>
            <Link href='/blog'>posts</Link>
            <span aria-hidden='true'>›</span>
            <span>{slug}</span>
            <span aria-hidden='true'>›</span>
          </>
        ) : (
          <span>posts</span>
        )}
        {slug && <span aria-current='page'>{file}</span>}
      </nav>
      <div className={styles.content}>{children}</div>
    </section>
  )
}

export default Reader
