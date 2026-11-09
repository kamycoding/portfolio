import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import type { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { routing } from '@/i18n/routing'

export const alt = 'Kamyar Zamanfar, kamycoding.com'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Built once per language at build time, like the pages.
export const generateStaticParams = () => routing.locales.map(locale => ({ locale }))

// Dark theme tokens from globals.css; the image has no CSS variables.
const COLOR = {
  bg: '#181818',
  text: '#cccccc',
  muted: '#9d9d9d',
  com: '#70a15a',
  kw: '#569cd6',
  hair: '#3c3c3c'
}

const font = (file: string) => readFile(join(process.cwd(), 'node_modules/geist/dist/fonts', file))

type ImageProps = Readonly<{ params: Promise<{ locale: string }> }>

// Social preview in the editor style, built only from copy the site already shows.
const OpenGraphImage = async ({ params }: ImageProps) => {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'hero' })

  const [sans, sansSemiBold, mono] = await Promise.all([
    font('geist-sans/Geist-Regular.ttf'),
    font('geist-sans/Geist-SemiBold.ttf'),
    font('geist-mono/GeistMono-Regular.ttf')
  ])

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: 72,
        background: COLOR.bg,
        color: COLOR.text,
        fontFamily: 'Geist'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'Geist Mono', fontSize: 26 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            border: `2.5px solid ${COLOR.text}`,
            borderRadius: 10,
            fontSize: 20
          }}
        >
          k/
        </div>
        kamycoding
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontFamily: 'Geist Mono', fontSize: 26, color: COLOR.com }}>{t('comment')}</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 24,

            // Sized so the longer German second line still fits on one line.
            fontSize: 74,
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: '-0.035em'
          }}
        >
          <span>{t('headline.line1')}</span>
          <span style={{ color: COLOR.muted }}>{t('headline.line2')}</span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 28,
          borderTop: `1px solid ${COLOR.hair}`,
          fontSize: 28
        }}
      >
        <span>Kamyar Zamanfar</span>
        <span style={{ fontFamily: 'Geist Mono', fontSize: 26, color: COLOR.kw }}>kamycoding.com</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Geist', data: sans, weight: 400 },
        { name: 'Geist', data: sansSemiBold, weight: 600 },
        { name: 'Geist Mono', data: mono, weight: 400 }
      ]
    }
  )
}

export default OpenGraphImage
