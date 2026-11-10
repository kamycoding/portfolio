import { journalFeedResponse } from '@/lib/blog/feed-response'

// English lives without a prefix, and the proxy leaves .xml paths alone, so this feed needs its own static route.
export const dynamic = 'force-static'

export const GET = () => journalFeedResponse('en')
