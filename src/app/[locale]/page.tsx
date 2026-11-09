import type { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import About from '@/components/about/about'
import Contact from '@/components/contact/contact'
import Hero from '@/components/hero/hero'
import Stack from '@/components/stack/stack'
import Work from '@/components/work/work'

type HomePageProps = Readonly<{
  params: Promise<{ locale: string }>
}>

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
      <Contact />
    </>
  )
}

export default HomePage
