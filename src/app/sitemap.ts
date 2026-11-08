export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'

import { getCaseStudies } from '@/lib/case-studies'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const caseStudies = await getCaseStudies()

  const routes = [
    '' /* This is equivalent to / */,
    '/contact',
    ...caseStudies.map(caseStudy => `/case-study/${caseStudy.slug}`)
  ]

  return routes.map(route => ({
    url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}${route}`
  }))
}
