import { getTranslations } from 'next-intl/server'

import { journalFeed } from './feed'
import { listPosts } from './posts'
import type { PostLanguage } from './schema'

// Shared by the two static feed routes; the English one has no locale segment because the proxy skips .xml paths.
export const journalFeedResponse = async (locale: PostLanguage) => {
  const t = await getTranslations({ locale, namespace: 'journal' })

  const xml = journalFeed({
    locale,
    title: t('metaTitle'),
    description: t('description'),
    category: category => t(`categories.${category}`),
    posts: await listPosts()
  })

  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } })
}
