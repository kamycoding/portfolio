import { getLocale, getTranslations } from 'next-intl/server'

import NotFoundView from '@/components/not-found-view'
import { getPathname } from '@/i18n/navigation'
import { listPosts } from '@/lib/blog/posts'
import { notFoundRoutes } from '@/lib/not-found'
import { localePath } from '@/lib/site'

const LocaleNotFound = async () => {
  const locale = (await getLocale()) === 'de' ? 'de' : 'en'
  const t = await getTranslations('notFound')
  const slugs = (await listPosts()).map(post => post.slug)

  const copy = {
    code: t('code'),
    heading: t('heading'),
    description: t('description'),
    navigationAria: t('navigationAria'),
    home: t('home'),
    projects: t('projects'),
    journal: t('journal'),

    // Raw, so NotFoundView fills the {route}, {home} and {journal} placeholders with links itself.
    suggestion: t.raw('suggestion') as string,
    fallback: t.raw('fallback') as string
  }

  return (
    <NotFoundView
      copy={copy}
      homeHref={getPathname({ href: '/', locale })}
      journalHref={localePath(locale, '/blog')}
      candidates={notFoundRoutes(locale, slugs)}
    />
  )
}

export default LocaleNotFound
