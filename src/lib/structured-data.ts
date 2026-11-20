import { AUTHOR_NAME, EMAIL, localePath, PROFILES, SITE_NAME, SITE_URL } from './site'

type SiteLocale = 'en' | 'de'

// One id per entity for the whole site, so every page describes the same person and the same website.
export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`

type PersonOptions = Readonly<{ jobTitle: string; description: string }>

/*
 * The one Person every graph uses, so the homepage and the articles cannot drift apart. Only facts the site already
 * states (CLAUDE.md "Content facts"); the image is the portrait of the about section.
 */
export const personNode = ({ jobTitle, description }: PersonOptions) => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: AUTHOR_NAME,
  url: SITE_URL,
  jobTitle,
  description,
  image: `${SITE_URL}/portrait.webp`,
  email: EMAIL,
  sameAs: [PROFILES.github, PROFILES.linkedin],
  knowsAbout: ['TypeScript', 'React', 'Next.js', 'Node.js', 'web development'],

  // State and country only: Cologne is in North Rhine-Westphalia, and the site never names a town or a street.
  address: { '@type': 'PostalAddress', addressRegion: 'North Rhine-Westphalia', addressCountry: 'DE' }
})

type HomeGraphOptions = PersonOptions & Readonly<{ locale: SiteLocale }>

// ProfilePage, Person and WebSite for the homepage of one language (docs/adr/0008).
export const homeGraph = ({ locale, jobTitle, description }: HomeGraphOptions) => {
  const url = `${SITE_URL}${localePath(locale)}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#profilepage`,
        url,
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID }
      },
      personNode({ jobTitle, description }),
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: ['en', 'de'],
        publisher: { '@id': PERSON_ID }
      }
    ]
  }
}
