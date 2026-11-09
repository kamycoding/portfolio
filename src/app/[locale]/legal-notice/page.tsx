import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import LegalNotice from '@/components/legal/legal-notice'

type LegalNoticePageProps = Readonly<{
  params: Promise<{ locale: string }>
}>

export const generateMetadata = async ({ params }: LegalNoticePageProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'legal' })

  return { title: t('noticeTitle') }
}

const LegalNoticePage = async ({ params }: LegalNoticePageProps) => {
  const { locale } = await params

  // The locale was already validated in the layout.
  setRequestLocale(locale as Locale)

  return <LegalNotice />
}

export default LegalNoticePage
