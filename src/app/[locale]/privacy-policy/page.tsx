import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import PrivacyPolicy from '@/components/legal/privacy-policy'
import { pageMetadata } from '@/lib/site'

type PrivacyPolicyPageProps = Readonly<{
  params: Promise<{ locale: string }>
}>

export const generateMetadata = async ({ params }: PrivacyPolicyPageProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'legal' })

  // The legal notice holds a home address, so both legal pages stay out of search results (links are still followed).
  return {
    ...pageMetadata({ locale, path: '/privacy-policy', title: t('privacyTitle') }),
    robots: { index: false, follow: true }
  }
}

const PrivacyPolicyPage = async ({ params }: PrivacyPolicyPageProps) => {
  const { locale } = await params

  // The locale was already validated in the layout.
  setRequestLocale(locale as Locale)

  return <PrivacyPolicy />
}

export default PrivacyPolicyPage
