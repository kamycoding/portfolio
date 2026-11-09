import type { ReactNode } from 'react'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'

import Footer from '@/components/shell/footer'
import Rulers from '@/components/shell/rulers'
import StatusBar from '@/components/shell/status-bar'
import TopBar from '@/components/shell/top-bar'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

import '../globals.css'

type LocaleLayoutProps = Readonly<{
  children: ReactNode
  params: Promise<{ locale: string }>
}>

export const generateStaticParams = () => routing.locales.map(locale => ({ locale }))

// English for both locales until the metadata pass in Phase 10.
export const metadata: Metadata = {
  title: 'Kamyar Zamanfar, full-stack developer',
  description: 'Full-stack developer near Cologne. TypeScript, React, Next.js and Node. Co-founder of Heldio.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png'
  }
}

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) notFound()

  // Lets every page below render statically instead of reading the locale from the request.
  setRequestLocale(locale)

  const t = await getTranslations('common')

  return (
    <html lang={locale} className={cn(GeistSans.variable, GeistMono.variable)} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          {/* next-themes sets data-theme in a blocking script before first paint, so there is no flash. */}
          <ThemeProvider attribute='data-theme' defaultTheme='system' themes={['dark', 'light']} storageKey='theme'>
            <a
              href='#main'
              className='bg-text text-bg fixed -top-15 left-3 z-100 rounded-md px-3 py-2 font-mono text-[13px] font-medium focus:top-3'
            >
              {t('skip')}
            </a>
            <TopBar />
            <Rulers />

            {/* Room for the fixed top bar, rulers and status bar. */}
            <div className='pt-[calc(var(--top)+var(--ruler))] pb-(--status) pl-(--ruler)'>
              <main id='main'>{children}</main>
              <Footer />
            </div>

            {/* Netlify sets BRANCH at build time; local builds show main. */}
            <StatusBar branch={process.env.BRANCH ?? 'main'} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
