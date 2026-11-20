import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import About from '@/components/about/about'
import JsonLd from '@/components/blog/json-ld'
import Contact from '@/components/contact/contact'
import Hero from '@/components/hero/hero'
import Journal from '@/components/journal/journal'
import Stack from '@/components/stack/stack'
import Work from '@/components/work/work'
import { homeGraph } from '@/lib/structured-data'

type HomePageProps = Readonly<{
  params: Promise<{ locale: string }>
}>

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params

  // The locale was already validated in the layout.
  setRequestLocale(locale as Locale)

  const t = await getTranslations('meta')
  const tHero = await getTranslations('hero')

  return (
    <>
      <Hero />
      <Work />
      <About />
      <Stack />
      <Journal />
      <Contact />
      {/* Who the site is about, for search engines: the same Person the articles name as author (docs/adr/0008). */}
      <JsonLd
        data={homeGraph({
          locale: locale === 'de' ? 'de' : 'en',
          jobTitle: tHero('headline.line2'),
          description: t('description')
        })}
      />
    </>
  )
}

export default HomePage
