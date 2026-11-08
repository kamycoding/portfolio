import type { ReactNode } from 'react'

import localFont from 'next/font/local'
import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import CustomCursor from '@/components/layout/custom-cursor'
import EdgeBlur from '@/components/layout/edge-blur'


import { cn } from '@/lib/utils'

import './globals.css'

// Self-hosted (from @fontsource) so builds don't depend on Google Fonts at build time
const geistMono = localFont({
  variable: '--font-geist-mono',
  src: [
    { path: '../assets/fonts/geist-mono/geist-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/geist-mono/geist-mono-latin-500-normal.woff2', weight: '500', style: 'normal' }
  ]
})

const deliciousHandrawn = localFont({
  variable: '--font-delicious-handrawn',
  src: [{ path: '../assets/fonts/delicious/delicious-handrawn-latin-400-normal.woff2', weight: '400', style: 'normal' }]
})

const vazirmatn = localFont({
  variable: '--font-vazirmatn',
  src: [{ path: '../assets/fonts/vazirmatn/vazirmatn-arabic-700-normal.woff2', weight: '700', style: 'normal' }]
})

const satoshi = localFont({
  variable: '--font-satoshi',
  display: 'swap',
  src: [
    { path: '../assets/fonts/satoshi/satoshi-400.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/satoshi/satoshi-500.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/satoshi/satoshi-700.woff2', weight: '700', style: 'normal' },
    { path: '../assets/fonts/satoshi/satoshi-900.woff2', weight: '900', style: 'normal' }
  ]
})

export const metadata: Metadata = {
  title: {
    template: '%s - Kamyar Zamanfar',
    default: 'Kamyar Zamanfar, Full-stack developer'
  },
  description:
    'Full-stack developer in Cologne building web products with Angular, React, TypeScript and Node.js. Co-founder of Heldio.',
  robots: 'index,follow',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  icons: {
    icon: [
      {
        url: '/favicon/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        url: '/favicon/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        url: '/favicon/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
    ],
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    other: [
      {
        url: '/favicon/android-chrome-192x192.png',
        rel: 'icon',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        url: '/favicon/android-chrome-512x512.png',
        rel: 'icon',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}`),
  openGraph: {
    title: {
      template: '%s - Kamyar Zamanfar',
      default: 'Kamyar Zamanfar, Full-stack developer'
    },
    description:
      'Full-stack developer in Cologne building web products with Angular, React, TypeScript and Node.js. Co-founder of Heldio.',
    type: 'website',
    siteName: 'Kamyar Zamanfar',
    url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}`,
    images: [
      {
        url: '/images/og-image.png',
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: 'Portfolio Landing page'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s - Kamyar Zamanfar',
      default: 'Kamyar Zamanfar, Full-stack developer'
    },
    description:
      'Full-stack developer in Cologne building web products with Angular, React, TypeScript and Node.js. Co-founder of Heldio.'
  }
}

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html
      lang='en'
      className={cn(
        geistMono.variable,
        satoshi.variable,
        deliciousHandrawn.variable,
        vazirmatn.variable,
        'flex min-h-full w-full scroll-smooth antialiased'
      )}
      suppressHydrationWarning
    >
      <body className='flex min-h-full w-full flex-auto flex-col'>
        <ThemeProvider attribute='class' enableSystem={false} disableTransitionOnChange>
          <TooltipProvider>{children}</TooltipProvider>
          <EdgeBlur />
          <Toaster />
          <CustomCursor />

        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
