import type { MetadataRoute } from 'next'

import { listPosts } from '@/lib/blog/posts'
import { journalSitemap } from '@/lib/blog/sitemap'
import { homeSitemap } from '@/lib/site'

// The home page in both languages plus the indexable journal URLs. Legal pages and journal notices are noindex.
const sitemap = async (): Promise<MetadataRoute.Sitemap> => [...homeSitemap(), ...journalSitemap(await listPosts())]

export default sitemap
