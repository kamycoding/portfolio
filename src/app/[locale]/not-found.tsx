import { getLocale, getTranslations } from 'next-intl/server'

import NotFoundView from '@/components/not-found-view'
import { getPathname } from '@/i18n/navigation'

const LocaleNotFound = async () => {
  const locale = await getLocale()
  const t = await getTranslations('notFound')

  const copy = {
    code: t('code'),
    heading: t('heading'),
    description: t('description'),
    navigationAria: t('navigationAria'),
    home: t('home'),
    projects: t('projects')
  }

  return <NotFoundView copy={copy} homeHref={getPathname({ href: '/', locale })} />
}

export default LocaleNotFound
