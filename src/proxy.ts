import type { NextRequest } from 'next/server'

import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'
import { isJournalRoute } from './lib/blog/routes'

const handleDefault = createMiddleware(routing)
const handleJournal = createMiddleware({ ...routing, alternateLinks: false })

const proxy = (request: NextRequest) =>
  isJournalRoute(request.nextUrl.pathname) ? handleJournal(request) : handleDefault(request)

export default proxy

export const config = {
  // Skip `/api` (redirected to the Netlify contact function), Next internals, any path with a file extension and the
  // Open Graph images, which are built per locale (/en/opengraph-image) and must not be redirected to the prefix-less URL.
  matcher: '/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)'
}
