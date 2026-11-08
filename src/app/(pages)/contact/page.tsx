import type { Metadata } from 'next'

// Component Imports
import ContactHero from '@/components/contact/contact-hero/contact-hero'
import FeaturedWorks from '@/components/shared/featured-works/featured-works'
import Services from '@/components/shared/services/services'
import Testimonials from '@/components/shared/testimonials/testimonials'

// Data Imports
import { getCaseStudies } from '@/lib/case-studies'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with us. We're here to help and answer any questions you may have.",
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/contact`
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}#website`,
      name: 'Kamyar Zamanfar',
      description: 'Full-stack developer based in Cologne.',
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      inLanguage: 'en-US'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}#webpage`,
      name: 'Contact Us',
      description: "Get in touch with us. We're here to help and answer any questions you may have.",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
      isPartOf: {
        '@id': `${process.env.NEXT_PUBLIC_APP_URL}#website`
      },
      potentialAction: {
        '@type': 'ReadAction',
        target: [`${process.env.NEXT_PUBLIC_APP_URL}/contact`]
      }
    }
  ]
}

const ContactUsPage = async () => {
  const caseStudies = await getCaseStudies(2)

  return (
    <>
      <ContactHero />
      <FeaturedWorks caseStudies={caseStudies} layout='vertical' title='Have a look at some of my work' />
      <Services />
      <Testimonials showBorder={false} />

      {/* Add JSON-LD to your page */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
        }}
      />
    </>
  )
}

export default ContactUsPage
