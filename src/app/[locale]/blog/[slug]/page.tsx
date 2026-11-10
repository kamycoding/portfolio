import { cache } from 'react'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import ArticleReading from '@/components/blog/article-reading'
import { learningComponents } from '@/components/blog/mdx/learning'
import Reader from '@/components/blog/reader'
import TranslationNotice from '@/components/blog/translation-notice'
import styles from '@/components/blog/blog.module.css'
import { journalPostMetadata } from '@/lib/blog/metadata'
import { listPosts } from '@/lib/blog/posts'
import { journalStaticParams, resolvePostRoute } from '@/lib/blog/routes'
import { postLanguageSchema } from '@/lib/blog/schema'

type PostProps = Readonly<{ params: Promise<{ locale: string; slug: string }> }>

export const generateStaticParams = async () => {
  const posts = await listPosts()

  return journalStaticParams(posts)
}

const resolvePage = cache(async (requestedLocale: string, slug: string) => {
  const result = postLanguageSchema.safeParse(requestedLocale)

  if (!result.success) notFound()

  const locale = result.data

  setRequestLocale(locale)

  const posts = await listPosts()
  const route = resolvePostRoute(posts, slug, locale)

  return { locale, route }
})

export const generateMetadata = async ({ params }: PostProps): Promise<Metadata> => {
  const { locale: requestedLocale, slug } = await params
  const { locale, route } = await resolvePage(requestedLocale, slug)

  // Throw from the page, not metadata, so the existing localized 404 keeps its shell.
  if (route.kind === 'unknown') {
    const t = await getTranslations({ locale, namespace: 'notFound' })

    return {
      title: t('heading'),
      robots: { index: false, follow: true },
      alternates: { canonical: null, languages: {} },
      openGraph: null,
      twitter: null
    }
  }

  const t = await getTranslations({ locale, namespace: 'journal' })

  return journalPostMetadata(locale, slug, route, { title: t('missingTitle'), description: t('missingMeta') })
}

const PostPage = async ({ params }: PostProps) => {
  const { locale: requestedLocale, slug } = await params
  const { locale, route } = await resolvePage(requestedLocale, slug)

  if (route.kind === 'unknown') notFound()

  if (route.kind === 'missing') {
    return (
      <Reader locale={locale} slug={slug}>
        <TranslationNotice
          slug={slug}
          language={route.available.metadata.lang}
          title={route.available.metadata.title}
        />
      </Reader>
    )
  }

  const t = await getTranslations({ locale, namespace: 'journal' })
  const { post } = route

  return (
    <Reader locale={locale} slug={slug}>
      <article lang={locale}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>
            {t(`categories.${post.metadata.category}`)} · {t(`formats.${post.metadata.format}`)} ·{' '}
            <time dateTime={post.metadata.date}>{post.metadata.date}</time>
          </p>
          <h1>{post.metadata.title}</h1>
          <p>{post.metadata.description}</p>
        </header>
        {/* Keyed by slug, so moving to another post remounts the tracker and resets progress. */}
        <ArticleReading key={slug} outline={post.outline}>
          <post.Content components={learningComponents(post)} />
        </ArticleReading>
      </article>
    </Reader>
  )
}

export default PostPage
