import { describe, expect, it } from 'vitest'

import de from '../../messages/de.json'
import en from '../../messages/en.json'

import { documentTitle, homeSitemap, pageMetadata, TITLE_LIMIT } from './site'

describe('documentTitle', () => {
  it('adds the site name while the result stays within the limit', () => {
    expect(documentTitle('The JavaScript Event Loop: Predict the Output')).toBe(
      'The JavaScript Event Loop: Predict the Output | kamycoding'
    )
  })

  it('uses the bare title when the site name would push it over the limit', () => {
    const title = 'German for Developers: What People Say in Dailies and Calls'

    expect(`${title} | kamycoding`.length).toBeGreaterThan(TITLE_LIMIT)
    expect(documentTitle(title)).toBe(title)
  })

  it('still adds the site name at exactly 60 characters and drops it at 61', () => {
    const fits = 'a'.repeat(TITLE_LIMIT - ' | kamycoding'.length)

    expect(documentTitle(fits)).toHaveLength(60)
    expect(documentTitle(`${fits}a`)).toBe(`${fits}a`)
  })
})

describe('fixed page titles', () => {
  it.each([
    en.meta.title,
    de.meta.title,
    en.journal.meta.title,
    de.journal.meta.title,
    en.legal.noticeTitle,
    en.legal.privacyTitle,
    de.legal.noticeTitle,
    de.legal.privacyTitle
  ])('"%s" stays within the limit', title => {
    expect(title.length).toBeLessThanOrEqual(TITLE_LIMIT)
  })
})

describe('homeSitemap', () => {
  it('lists both homepages with the language alternates of their HTML', () => {
    const languages = {
      en: 'https://kamycoding.com/',
      de: 'https://kamycoding.com/de',
      'x-default': 'https://kamycoding.com/'
    }

    expect(homeSitemap()).toEqual([
      { url: 'https://kamycoding.com/', alternates: { languages } },
      { url: 'https://kamycoding.com/de', alternates: { languages } }
    ])
    expect(Object.keys(languages)).toEqual(
      Object.keys(pageMetadata({ locale: 'en', title: 'Fixture' }).alternates!.languages!)
    )
  })
})
