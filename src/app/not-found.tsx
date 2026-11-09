import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import NotFoundView from '@/components/not-found-view'
import { cn } from '@/lib/utils'

import messages from '../../messages/en.json'

import './globals.css'

// Only reached for requests the proxy skips (no locale), so it renders its own <html> in English.
const RootNotFound = () => {
  return (
    <html lang='en' className={cn(GeistSans.variable, GeistMono.variable)}>
      <body>
        <main id='main' className='flex min-h-screen flex-col justify-center'>
          <NotFoundView copy={messages.notFound} homeHref='/' />
        </main>
      </body>
    </html>
  )
}

export default RootNotFound
