import { getTranslations } from 'next-intl/server'

import { articleCards } from '@/lib/blog/card'
import type { PublishedPost } from '@/lib/blog/posts'
import { journalIndexPosts } from '@/lib/blog/routes'
import type { PostLanguage } from '@/lib/blog/schema'

import { ArticleCardList } from './article-card'
import Reader from './reader'
import styles from './blog.module.css'

const BlogIndex = async ({ locale, posts }: Readonly<{ locale: PostLanguage; posts: readonly PublishedPost[] }>) => {
  const t = await getTranslations({ locale, namespace: 'journal' })
  const cards = await articleCards(posts, journalIndexPosts(posts, locale))

  return (
    <Reader locale={locale}>
      <header className={styles.heading}>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </header>
      {cards.length === 0 ? (
        <p className={styles.empty}>{t('empty')}</p>
      ) : (
        <ArticleCardList cards={cards} headingLevel={2} className={styles.cards} />
      )}
    </Reader>
  )
}

export default BlogIndex
