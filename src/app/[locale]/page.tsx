import type { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import About from '@/components/about/about'
import Hero from '@/components/hero/hero'
import Section, { SectionHeading } from '@/components/shell/section'
import Stack from '@/components/stack/stack'
import Work from '@/components/work/work'

type HomePageProps = Readonly<{
  params: Promise<{ locale: string }>
}>

// Sections still waiting for their phase (contact: 8).
const PLACEHOLDERS = ['contact'] as const

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params

  // The locale was already validated in the layout.
  setRequestLocale(locale as Locale)

  return (
    <>
      <Hero />
      <Work />
      <About />
      <Stack />

      {PLACEHOLDERS.map(id => (
        <Section key={id} id={id}>
          <SectionHeading id={id} />
        </Section>
      ))}
    </>
  )
}

export default HomePage
