import { ImageResponse } from 'next/og'
import { notFound } from 'next/navigation'

import { getTranslations } from 'next-intl/server'

import { ogFonts, ogFrame, OG_COLOR as COLOR } from '@/components/og/frame'
import { createMeasure } from '@/components/og/metrics'
import { layoutTitle } from '@/components/og/title'
import { listPosts } from '@/lib/blog/posts'

const size = { width: 1200, height: 630 }

/*
 * A static route instead of opengraph-image.tsx: the file convention adds its tags to every page of the segment,
 * notices included. Article metadata links this file; only published translations get one (docs/adr/0007).
 */
export const dynamic = 'force-static'
export const dynamicParams = false

export const generateStaticParams = async () =>
  (await listPosts()).map(post => ({ locale: post.metadata.lang, slug: post.slug }))

type ImageContext = Readonly<{ params: Promise<{ locale: string; slug: string }> }>

// The frame's padding (72), the outline's padding (24) and border (1.5) on both sides leave this for the title.
const TITLE_WIDTH = 1200 - 2 * 72 - 2 * 24 - 2 * 1.5
const TITLE_SIZES = [64, 56, 48]

// A blueprint sheet of the article: the title in a dashed outline, a dimension line and a title block.
export const GET = async (_request: Request, { params }: ImageContext) => {
  const { locale, slug } = await params
  const post = (await listPosts()).find(item => item.slug === slug && item.metadata.lang === locale)

  if (!post) notFound()

  const t = await getTranslations({ locale: post.metadata.lang, namespace: 'journal' })
  const { title, category, date } = post.metadata
  const fonts = await ogFonts()
  const semiBold = fonts.find(font => font.weight === 600 && font.name === 'Geist')!

  const layout = layoutTitle(title, {
    measure: createMeasure(semiBold.data),
    maxWidth: TITLE_WIDTH,
    sizes: TITLE_SIZES
  })

  return new ImageResponse(
    ogFrame(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontFamily: 'Geist Mono', fontSize: 26, color: COLOR.com }}>
          {`// ${t('title').toLowerCase()} · ${t(`categories.${category}`).toLowerCase()}`}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 22,
            padding: '18px 24px',
            border: `1.5px dashed ${COLOR.hair}`,
            fontSize: layout?.size ?? TITLE_SIZES.at(-1),
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: '-0.03em'
          }}
        >
          {/* Balanced lines when they fit, otherwise normal wrapping at the smallest size. */}
          {layout ? layout.lines.map(line => <span key={line}>{line}</span>) : title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 14, color: COLOR.muted }}>
          <div style={{ display: 'flex', width: 1.5, height: 14, background: COLOR.muted }} />
          <div style={{ display: 'flex', flexGrow: 1, height: 1.5, background: COLOR.hair }} />
          <div style={{ display: 'flex', width: 1.5, height: 14, background: COLOR.muted }} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 10,
            fontFamily: 'Geist Mono',
            fontSize: 20,
            color: COLOR.muted
          }}
        >
          <span>{`blog/${slug}.mdx`}</span>
          <span>{`DATE ${date} · ${locale.toUpperCase()}`}</span>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
