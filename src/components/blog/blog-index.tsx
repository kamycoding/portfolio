import { getTranslations } from 'next-intl/server'

import type { PublishedPost } from '@/lib/blog/posts'
import { journalIndexPosts } from '@/lib/blog/routes'
import type { PostLanguage } from '@/lib/blog/schema'

import PostLink from './post-link'
import Reader from './reader'
import styles from './blog.module.css'

const BlogIndex = async ({ locale, posts }: Readonly<{ locale: PostLanguage; posts: readonly PublishedPost[] }>) => {
  const t = await getTranslations({ locale, namespace: 'journal' })
  const entries = journalIndexPosts(posts, locale)

  return (
    <Reader locale={locale}>
      <header className={styles.heading}>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </header>
      {entries.length === 0 ? (
        <p className={styles.empty}>{t('empty')}</p>
      ) : (
        <ul className={styles.posts}>
          {entries.map(post => (
            <li key={post.slug}>
              <time dateTime={post.metadata.date}>{post.metadata.date}</time>
              <h2>
                <PostLink slug={post.slug} language={post.metadata.lang}>
                  {post.metadata.title}
                </PostLink>
              </h2>
              <p lang={post.metadata.lang}>{post.metadata.description}</p>
              <span className={styles.language}>
                {post.metadata.lang === locale
                  ? t(`languages.${post.metadata.lang}`)
                  : t('availableOnly', { language: t(`languages.${post.metadata.lang}`) })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Reader>
  )
}

export default BlogIndex
