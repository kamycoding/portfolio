import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { ReactNode } from 'react'

import { getLocale, getTranslations } from 'next-intl/server'

import Breadcrumb from '@/components/shell/breadcrumb'
import { HEADING_CLASS } from '@/components/shell/section'
import {
  cardBadges,
  type EditorCard as EditorCardData,
  firstClip,
  homePosts,
  readingMinutes,
  sectionWeights,
  shortName
} from '@/lib/blog/home'
import { listPosts } from '@/lib/blog/posts'
import { SITE_URL, localePath } from '@/lib/site'
import { cn } from '@/lib/utils'

import EditorCard from './editor-card'
import JournalEditors from './journal-editor'
import styles from './journal.module.css'

const soft = (chunks: ReactNode) => <span className='text-muted'>{chunks}</span>

// Prerendered at build time, so each file is read once per build; without it reading time and minimap are left out.
const sourceOf = async (slug: string, lang: string) => {
  try {
    return await readFile(path.join(process.cwd(), 'content/posts', slug, `${lang}.mdx`), 'utf8')
  } catch {
    return null
  }
}

/*
 * blog/ on the homepage, as VS Code's "Open editors": every post is a small editor window in a scrolling row, with a
 * last card to the index. Not one of the top-bar tabs (blog/ already is one), and absent while nothing is published.
 */
const Journal = async () => {
  const locale = (await getLocale()) === 'de' ? 'de' : 'en'
  const all = await listPosts()
  const posts = homePosts(all, locale)

  if (posts.length === 0) return null

  const t = await getTranslations('journal')

  const cards: EditorCardData[] = await Promise.all(
    posts.map(async post => {
      const { slug, metadata } = post
      const source = await sourceOf(slug, metadata.lang)
      const listen = firstClip(post)
      const translations = all.filter(item => item.slug === slug).map(item => item.metadata.lang)
      const languages = (['en', 'de'] as const).filter(lang => translations.includes(lang))

      return {
        slug,
        fileName: shortName(slug),
        lang: metadata.lang,
        languages,
        other: languages.find(lang => lang !== metadata.lang) ?? null,
        title: metadata.title,
        summary: metadata.tldr ?? metadata.description,
        date: metadata.date,
        categoryId: metadata.category,
        category: t(`categories.${metadata.category}`),
        tags: metadata.tags,
        preview: metadata.preview ?? [],
        minimap: source ? sectionWeights(source, post.outline.filter(item => item.depth === 2).length) : null,
        minutes: source ? readingMinutes(source) : null,
        badges: cardBadges(post, listen),
        listen,
        url: `${SITE_URL}${localePath(metadata.lang, `/blog/${slug}`)}`
      }
    })
  )

  const categories = [...new Map(cards.map(card => [card.categoryId, card.category])).entries()].map(([id, label]) => ({
    id,
    label
  }))

  const items = cards.map(card => ({
    key: card.slug,
    titleId: `editor-${card.slug}`,
    search: `${card.title} ${card.tags.join(' ')}`.toLowerCase(),
    category: card.categoryId,
    node: <EditorCard card={card} titleId={`editor-${card.slug}`} />
  }))

  return (
    <section id='journal' data-file='blog/' className='border-hair relative border-t'>
      <Breadcrumb path={['content', 'posts']} file='blog/' meta={t('home.meta', { count: posts.length })} />
      <div className='mx-auto max-w-(--max) px-(--gutter) pt-24 pb-30'>
        <p className='text-com mb-4.5 font-mono text-[13px]'>{t('home.eyebrow')}</p>
        <h2 className={HEADING_CLASS}>{t.rich('home.title', { soft })}</h2>

        <JournalEditors
          items={items}
          categories={categories}
          last={
            <div className={cn(styles.window, styles.all)}>
              <div className={styles.tab}>
                <span className={styles.file}>
                  <span aria-hidden='true' className={styles.mdBadge}>
                    ▸
                  </span>
                  blog/
                </span>
              </div>
              <div className={styles.code}>
                <div className={styles.lines}>
                  <div className={styles.line}>
                    <span aria-hidden='true' className={styles.ln}>
                      1
                    </span>
                    <span className={styles.title}>
                      <span aria-hidden='true' className={styles.hash}>
                        #{' '}
                      </span>
                      {t('home.allPosts')}
                    </span>
                  </div>
                  <div className={styles.line}>
                    <span aria-hidden='true' className={styles.ln}>
                      2
                    </span>
                    <span className={cn(styles.src, styles.com)}>{`// ${t('home.meta', { count: all.length })}`}</span>
                  </div>
                </div>
              </div>
              <p className={styles.foot}>
                <span>
                  {t('title')} <span aria-hidden='true'>→</span>
                </span>
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}

export default Journal
