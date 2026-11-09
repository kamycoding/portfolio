import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import LegalNotice from '@/components/legal/legal-notice'
import { pageMetadata } from '@/lib/site'

type LegalNoticePageProps = Readonly<{
  params: Promise<{ locale: string }>
}>

export const generateMetadata = async ({ params }: LegalNoticePageProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'legal' })

  // The legal notice holds a home address, so both legal pages stay out of search results (links are still followed).
  return {
    ...pageMetadata({ locale, path: '/legal-notice', title: t('noticeTitle') }),
    robots: { index: false, follow: true }
  }
}

const LegalNoticePage = async ({ params }: LegalNoticePageProps) => {
  const { locale } = await params

  // The locale was already validated in the layout.
  setRequestLocale(locale as Locale)

  return <LegalNotice />
}

export default LegalNoticePage
