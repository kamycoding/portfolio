import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { ReactNode } from 'react'

import { getLocale, getTranslations } from 'next-intl/server'

import Breadcrumb from '@/components/shell/breadcrumb'
import { HEADING_CLASS } from '@/components/shell/section'
import { homePosts, type HomePost, outlineHeadings, postContrast, postStats, readingMinutes } from '@/lib/blog/home'
import { listPosts } from '@/lib/blog/posts'

import JournalEditor from './journal-editor'

const soft = (chunks: ReactNode) => <span className='text-muted'>{chunks}</span>

// Prerendered at build time, so the file is read once per build; without it the reading time is simply left out.
const minutesOf = async (slug: string, lang: string) => {
  try {
    return readingMinutes(await readFile(path.join(process.cwd(), 'content/posts', slug, `${lang}.mdx`), 'utf8'))
  } catch {
    return null
  }
}

/*
 * blog/ on the homepage, built like a split editor: the posts as an explorer tree, the selected one as a preview.
 * Not one of the top-bar tabs (blog/ is already there), and absent while nothing is published.
 */
const Journal = async () => {
  const locale = (await getLocale()) === 'de' ? 'de' : 'en'
  const posts = homePosts(await listPosts(), locale)

  if (posts.length === 0) return null

  const t = await getTranslations('journal')

  const items: HomePost[] = await Promise.all(
    posts.map(async post => ({
      slug: post.slug,
      lang: post.metadata.lang,
      title: post.metadata.title,
      summary: post.metadata.tldr ?? post.metadata.description,
      hasTldr: Boolean(post.metadata.tldr),
      date: post.metadata.date,
      category: t(`categories.${post.metadata.category}`),
      format: t(`formats.${post.metadata.format}`),
      headings: outlineHeadings(post.outline),
      contrast: postContrast(post),
      stats: postStats(post, await minutesOf(post.slug, post.metadata.lang))
    }))
  )

  return (
    <section id='journal' data-file='blog/' className='border-hair relative border-t'>
      <Breadcrumb path={['content', 'posts']} file='blog/' meta={t('home.meta', { count: posts.length })} />
      <div className='mx-auto max-w-(--max) px-(--gutter) pt-24 pb-30'>
        <p className='text-com mb-4.5 font-mono text-[13px]'>{t('home.eyebrow')}</p>
        <h2 className={HEADING_CLASS}>{t.rich('home.title', { soft })}</h2>
        <JournalEditor posts={items} />
      </div>
    </section>
  )
}

export default Journal
