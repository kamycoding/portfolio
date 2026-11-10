import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import NotFoundView from '@/components/not-found-view'
import { listPosts } from '@/lib/blog/posts'
import { notFoundRoutes } from '@/lib/not-found'
import { cn } from '@/lib/utils'

import messages from '../../messages/en.json'

import './globals.css'

// Only reached for requests the proxy skips (no locale), so it renders its own <html> in English.
const RootNotFound = async () => {
  const slugs = (await listPosts()).map(post => post.slug)

  return (
    <html lang='en' className={cn(GeistSans.variable, GeistMono.variable)}>
      <body>
        <main id='main' className='flex min-h-screen flex-col justify-center'>
          <NotFoundView
            copy={messages.notFound}
            homeHref='/'
            journalHref='/blog'
            candidates={notFoundRoutes('en', slugs)}
          />
        </main>
      </body>
    </html>
  )
}

export default RootNotFound
