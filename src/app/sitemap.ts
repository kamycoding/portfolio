import type { MetadataRoute } from 'next'

import { listPosts } from '@/lib/blog/posts'
import { journalSitemap } from '@/lib/blog/sitemap'
import { localePath, SITE_URL } from '@/lib/site'

// The home page in both languages plus the indexable journal URLs. Legal pages and journal notices are noindex.
const sitemap = async (): Promise<MetadataRoute.Sitemap> => [
  ...(['en', 'de'] as const).map(locale => ({
    url: `${SITE_URL}${localePath(locale)}`,
    alternates: {
      languages: { en: `${SITE_URL}${localePath('en')}`, de: `${SITE_URL}${localePath('de')}` }
    }
  })),
  ...journalSitemap(await listPosts())
]

export default sitemap
