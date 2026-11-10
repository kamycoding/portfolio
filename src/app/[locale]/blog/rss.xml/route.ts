import { journalFeedResponse } from '@/lib/blog/feed-response'

// German only: English is served from app/blog/rss.xml, so /en/blog/rss.xml stays a 404.
export const dynamic = 'force-static'
export const dynamicParams = false

export const generateStaticParams = () => [{ locale: 'de' }]

export const GET = () => journalFeedResponse('de')
