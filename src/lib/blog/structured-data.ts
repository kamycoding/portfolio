import { AUTHOR_NAME, localePath, PROFILES, SITE_NAME, SITE_URL } from '../site'

import { articleImagePath } from './metadata'
import type { PublishedPost } from './posts'

type ArticleGraphOptions = Readonly<{
  post: PublishedPost
  journalName: string
  jobTitle: string
  section: string
}>

const PERSON_ID = `${SITE_URL}/#person`

/*
 * BlogPosting, BreadcrumbList and Person for one published translation; notices get none. DefinedTerm for
 * glossary terms is a Phase 2 idea (docs/adr/0007).
 */
export const articleGraph = ({ post, journalName, jobTitle, section }: ArticleGraphOptions) => {
  const { slug, metadata } = post
  const locale = metadata.lang
  const journal = `${SITE_URL}${localePath(locale, '/blog')}`
  const url = `${SITE_URL}${localePath(locale, `/blog/${slug}`)}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: metadata.title,
        description: metadata.description,
        datePublished: metadata.date,
        dateModified: metadata.updated ?? metadata.date,
        inLanguage: locale,
        url,
        mainEntityOfPage: url,
        image: `${SITE_URL}${articleImagePath(locale, slug)}`,
        articleSection: section,
        ...(metadata.tags.length > 0 && { keywords: metadata.tags.join(', ') }),
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        isPartOf: { '@type': 'Blog', '@id': `${journal}#blog`, name: journalName, url: journal }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}${localePath(locale)}` },
          { '@type': 'ListItem', position: 2, name: journalName, item: journal },
          { '@type': 'ListItem', position: 3, name: metadata.title, item: url }
        ]
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: AUTHOR_NAME,
        jobTitle,
        url: SITE_URL,
        sameAs: [PROFILES.github, PROFILES.linkedin]
      }
    ]
  }
}

// Every "<" becomes <, still valid JSON, so no text can close the script element early.
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replaceAll('<', '\\u003c')
