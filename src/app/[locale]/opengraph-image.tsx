import { ImageResponse } from 'next/og'

import type { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { ogFonts, ogFrame, OG_COLOR as COLOR } from '@/components/og/frame'
import { routing } from '@/i18n/routing'
import { HOME_IMAGE_ALT } from '@/lib/site'

export const alt = HOME_IMAGE_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Built once per language at build time, like the pages.
export const generateStaticParams = () => routing.locales.map(locale => ({ locale }))

type ImageProps = Readonly<{ params: Promise<{ locale: string }> }>

// Social preview in the editor style, built only from copy the site already shows.
const OpenGraphImage = async ({ params }: ImageProps) => {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'hero' })

  return new ImageResponse(
    ogFrame(
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
    ),
    {
      ...size,
      fonts: await ogFonts()
    }
  )
}

export default OpenGraphImage
