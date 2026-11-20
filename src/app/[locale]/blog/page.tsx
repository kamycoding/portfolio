import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import BlogIndex from '@/components/blog/blog-index'
import { journalIndexMetadata } from '@/lib/blog/metadata'
import { listPosts } from '@/lib/blog/posts'
import { postLanguageSchema } from '@/lib/blog/schema'

type IndexProps = Readonly<{ params: Promise<{ locale: string }> }>

export const generateMetadata = async ({ params }: IndexProps): Promise<Metadata> => {
  const result = postLanguageSchema.safeParse((await params).locale)

  if (!result.success) notFound()

  const locale = result.data
  const t = await getTranslations({ locale, namespace: 'journal' })
  const posts = await listPosts()

  // Its own search title and description; the page keeps the short tagline (docs/adr/0008).
  return journalIndexMetadata(locale, t('meta.title'), t('meta.description'), t('feedTitle'), posts.length > 0)
}

const BlogPage = async ({ params }: IndexProps) => {
  const result = postLanguageSchema.safeParse((await params).locale)

  if (!result.success) notFound()

  setRequestLocale(result.data)

  return <BlogIndex locale={result.data} posts={await listPosts()} />
}

export default BlogPage
