import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Skip `/api` (redirected to the Netlify contact function), Next internals, any path with a file extension and the
  // Open Graph images, which are built per locale (/en/opengraph-image) and must not be redirected to the prefix-less URL.
  matcher: '/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)'
}
