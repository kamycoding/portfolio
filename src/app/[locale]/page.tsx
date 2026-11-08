import type { ReactNode } from 'react'

import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type HomePageProps = Readonly<{
  params: Promise<{ locale: string }>
}>

// Bare page for the foundation phase: the real sections replace these in Phases 3 to 8.
const SECTIONS = ['work', 'about', 'stack', 'contact'] as const

const soft = (chunks: ReactNode) => <span className='text-muted'>{chunks}</span>

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params

  // The locale was already validated in the layout.
  setRequestLocale(locale as Locale)

  const t = await getTranslations()

  return (
    <main id='main'>
      <section id='index' className='mx-auto max-w-(--max) px-(--gutter) pt-24 pb-30'>
        <p className='text-com mb-5.5 font-mono text-[13px]'>{t('hero.comment')}</p>
        <h1 className='max-w-[16ch] text-[clamp(40px,4.9vw,78px)] leading-[1.03] font-semibold tracking-[-0.042em]'>
          {t('hero.headline.line1')}
          <span className='text-muted block'>{t('hero.headline.line2')}</span>
        </h1>
      </section>

      {SECTIONS.map(id => (
        <section key={id} id={id} className='border-hair border-t'>
          <div className='mx-auto max-w-(--max) px-(--gutter) pt-24 pb-30'>
            <p className='text-com mb-4.5 font-mono text-[13px]'>{t(`sections.${id}.eyebrow`)}</p>
            <h2 className='max-w-[18ch] text-[clamp(32px,3.6vw,54px)] leading-[1.06] font-semibold tracking-[-0.035em]'>
              {t.rich(`sections.${id}.title`, { soft })}
            </h2>
          </div>
        </section>
      ))}
    </main>
  )
}

export default HomePage
