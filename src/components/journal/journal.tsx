import type { ReactNode } from 'react'

import { getLocale, getTranslations } from 'next-intl/server'

import { ArticleCardList } from '@/components/blog/article-card'
import Breadcrumb from '@/components/shell/breadcrumb'
import { HEADING_CLASS } from '@/components/shell/section'
import { Link } from '@/i18n/navigation'
import { articleCards } from '@/lib/blog/card'
import { homePosts } from '@/lib/blog/home'
import { listPosts } from '@/lib/blog/posts'

const soft = (chunks: ReactNode) => <span className='text-muted'>{chunks}</span>

/*
 * blog/ on the homepage: the newest three posts as article cards and a link to the index. Not one of the top-bar tabs
 * (blog/ already is one), and absent while nothing is published.
 */
const Journal = async () => {
  const locale = (await getLocale()) === 'de' ? 'de' : 'en'
  const all = await listPosts()
  const posts = homePosts(all, locale)

  if (posts.length === 0) return null

  const t = await getTranslations('journal')
  const cards = await articleCards(all, posts)
  const total = new Set(all.map(post => post.slug)).size

  return (
    <section id='journal' data-file='blog/' className='border-hair relative border-t'>
      <Breadcrumb path={['content', 'posts']} file='blog/' meta={t('home.meta', { count: total })} />
      <div className='mx-auto max-w-(--max) px-(--gutter) pt-24 pb-30'>
        <p className='text-com mb-4.5 font-mono text-[13px]'>{t('home.eyebrow')}</p>
        <h2 className={HEADING_CLASS}>{t.rich('home.title', { soft })}</h2>

        <ArticleCardList cards={cards} headingLevel={3} className='mt-12' />

        <p className='mt-8'>
          <Link
            href='/blog'
            className='text-kw text-base font-medium underline decoration-1 underline-offset-4 hover:decoration-2'
          >
            {t('home.allArticles')} <span aria-hidden='true'>→</span>
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Journal
