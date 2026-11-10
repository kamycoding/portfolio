'use client'

import { type ReactNode, useEffect, useRef } from 'react'

import { trackArticle, useArticleProgress } from '@/hooks/use-article-progress'
import type { OutlineItem } from '@/lib/blog/schema'
import { cn } from '@/lib/utils'

import Outline from './outline'
import styles from './blog.module.css'
import prose from './prose.module.css'

type ArticleReadingProps = Readonly<{ outline: readonly OutlineItem[]; children: ReactNode }>

// The article body with its Outline; only the body is measured, so the footer never counts as reading.
const ArticleReading = ({ outline, children }: ArticleReadingProps) => {
  const body = useRef<HTMLDivElement>(null)
  const { activeId } = useArticleProgress()
  const ids = outline.map(item => item.id).join(' ')

  useEffect(() => trackArticle(body.current!, ids ? ids.split(' ') : []), [ids])

  if (outline.length === 0) {
    return (
      <div className={styles.reading}>
        <div ref={body} className={prose.prose}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(styles.reading, styles.withOutline)}>
      <Outline outline={outline} activeId={activeId} variant='contents' />
      <div ref={body} className={prose.prose}>
        {children}
      </div>
      <Outline outline={outline} activeId={activeId} variant='aside' />
    </div>
  )
}

export default ArticleReading
