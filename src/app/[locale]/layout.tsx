import type { ReactNode } from 'react'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { hasLocale, type Locale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'

import Boot from '@/components/shell/boot'
import CommandPalette from '@/components/shell/command-palette'
import Cursor from '@/components/shell/cursor'
import Footer from '@/components/shell/footer'
import Rulers from '@/components/shell/rulers'
import StatusBar from '@/components/shell/status-bar'
import Toast from '@/components/shell/toast'
import TopBar from '@/components/shell/top-bar'
import { routing } from '@/i18n/routing'
import { pageMetadata, SITE_URL } from '@/lib/site'
import { APP_VERSION, versionLabel } from '@/lib/version'
import { THEME_IDS } from '@/lib/themes'
import { cn } from '@/lib/utils'

import '../globals.css'

type LocaleLayoutProps = Readonly<{
  children: ReactNode
  params: Promise<{ locale: string }>
}>

export const generateStaticParams = () => routing.locales.map(locale => ({ locale }))

const ICONS: Metadata['icons'] = {
  icon: [
    { url: '/favicon.ico', sizes: '48x48' },
    { url: '/favicon.svg', type: 'image/svg+xml' },
    { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' }
  ],
  apple: '/apple-touch-icon.png'
}

// Title and description per language; the Open Graph image comes from opengraph-image.tsx next to this file.
export const generateMetadata = async ({ params }: Pick<LocaleLayoutProps, 'params'>): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'meta' })

  return {
    metadataBase: new URL(SITE_URL),
    ...pageMetadata({ locale, title: t('title'), description: t('description') }),
    icons: ICONS
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
        {/* Marks JavaScript as available before first paint, so first-paint fades only hide content when they can run. */}
        <Script id='js-flag' strategy='beforeInteractive'>
          {`document.documentElement.classList.add('js')`}
        </Script>
        <NextIntlClientProvider>
          {/* next-themes sets data-theme in a blocking script before first paint, so there is no flash. */}
          <ThemeProvider attribute='data-theme' defaultTheme='system' themes={THEME_IDS} storageKey='theme'>
            <a
              href='#main'
              className='bg-text text-bg fixed -top-15 left-3 z-100 rounded-md px-3 py-2 font-mono text-[13px] font-medium focus:top-3'
            >
              {t('skip')}
            </a>

            {/* Static in the HTML, so it covers the page from the first paint until the build log ends. */}
            <Boot version={APP_VERSION} />
            <TopBar versionLabel={versionLabel(APP_VERSION)} />
            <Rulers />

            {/* Room for the fixed top bar, rulers and status bar. */}
            <div className='pt-[calc(var(--top)+var(--ruler))] pb-(--status) pl-(--ruler)'>
              <main id='main'>{children}</main>
              <Footer />
            </div>

            {/* Netlify sets BRANCH at build time; local builds show main. */}
            <StatusBar branch={process.env.BRANCH ?? 'main'} />
            <Toast />
            <CommandPalette />
            <Cursor />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
