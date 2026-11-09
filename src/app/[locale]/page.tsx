import type { ReactNode } from 'react'

import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import Hero from '@/components/hero/hero'
import Breadcrumb from '@/components/shell/breadcrumb'
import { SECTIONS } from '@/lib/sections'

type HomePageProps = Readonly<{
  params: Promise<{ locale: string }>
}>

const soft = (chunks: ReactNode) => <span className='text-muted'>{chunks}</span>

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params

  // The locale was already validated in the layout.
  setRequestLocale(locale as Locale)

  const t = await getTranslations()

  return (
    <>
      <Hero />

      {/* Placeholder content: the real sections replace it in Phases 4 to 8. */}

      {SECTIONS.map(section =>
        section.crumb === null ? null : (
          <section key={section.id} id={section.id} data-file={section.file} className='border-hair relative border-t'>
            <Breadcrumb path={section.crumb} file={section.file} meta={t(`sections.${section.id}.meta`)} />
            <div className='mx-auto max-w-(--max) px-(--gutter) pt-24 pb-30'>
              <p className='text-com mb-4.5 font-mono text-[13px]'>{t(`sections.${section.id}.eyebrow`)}</p>
              <h2 className='max-w-[18ch] text-[clamp(32px,3.6vw,54px)] leading-[1.06] font-semibold tracking-[-0.035em]'>
                {t.rich(`sections.${section.id}.title`, { soft })}
              </h2>
            </div>
          </section>
        )
      )}
    </>
  )
}

export default HomePage
