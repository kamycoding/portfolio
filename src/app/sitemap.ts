import type { MetadataRoute } from 'next'

import { localePath, SITE_URL } from '@/lib/site'

// Only the home page in both languages. The legal pages are noindex and stay out of the sitemap.
const sitemap = (): MetadataRoute.Sitemap =>
  (['en', 'de'] as const).map(locale => ({
    url: `${SITE_URL}${localePath(locale)}`,
    alternates: {
      languages: { en: `${SITE_URL}${localePath('en')}`, de: `${SITE_URL}${localePath('de')}` }
    }
  }))

export default sitemap
