import { useId } from 'react'

import { useTranslations } from 'next-intl'

import type { ArticleCardData } from '@/lib/blog/card'

import { ArticleCardList } from './article-card'
import styles from './blog.module.css'

/*
 * Other posts after an article. It sits outside the article and its measured body, so it is not in the Outline and
 * never counts as reading. The generated id cannot collide with a heading id of the article.
 */
const KeepReading = ({ cards }: Readonly<{ cards: readonly ArticleCardData[] }>) => {
  const t = useTranslations('journal')
  const id = useId()

  if (cards.length === 0) return null

  return (
    <section className={styles.related} aria-labelledby={id}>
      <h2 id={id}>{t('keepReading')}</h2>
      <ArticleCardList cards={cards} headingLevel={3} />
    </section>
  )
}

export default KeepReading
