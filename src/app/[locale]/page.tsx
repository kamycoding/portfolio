import type { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import Hero from '@/components/hero/hero'
import Section, { SectionHeading } from '@/components/shell/section'
import Work from '@/components/work/work'

type HomePageProps = Readonly<{
  params: Promise<{ locale: string }>
}>

// Sections still waiting for their phase (about: 5, stack: 6, contact: 8).
const PLACEHOLDERS = ['about', 'stack', 'contact'] as const

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params

  // The locale was already validated in the layout.
  setRequestLocale(locale as Locale)

  return (
    <>
      <Hero />
      <Work />

      {PLACEHOLDERS.map(id => (
        <Section key={id} id={id}>
          <SectionHeading id={id} />
        </Section>
      ))}
    </>
  )
}

export default HomePage
