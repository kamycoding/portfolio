import { useLocale, useTranslations } from 'next-intl'

import type { ArticleCardData } from '@/lib/blog/card'
import { cn } from '@/lib/utils'

import PostLink from './post-link'
import styles from './article-card.module.css'

// Day, short month and year in the reader's convention: "10 Nov 2026", "10. Nov. 2026". UTC, since it is a calendar day.
const DATE_LOCALE = { en: 'en-GB', de: 'de-DE' } as const

type ArticleCardProps = Readonly<{ card: ArticleCardData; headingLevel: 2 | 3 }>

/*
 * One article as a plain card: what it is about, its title, two lines of description, date and reading time. The
 * title is the only link and stretches over the card, so the whole card is clickable but read as one link.
 */
const ArticleCard = ({ card, headingLevel }: ArticleCardProps) => {
  const t = useTranslations('journal')
  const locale = useLocale() === 'de' ? 'de' : 'en'
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  const languages = card.languages.includes(locale)
    ? new Intl.ListFormat(locale, { style: 'short', type: 'unit' }).format(
        card.languages.map(lang => t(`languages.${lang}`))
      )
    : t('availableOnly', { language: t(`languages.${card.lang}`) })

  const date = new Intl.DateTimeFormat(DATE_LOCALE[locale], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(Date.parse(card.date))

  // data-frame-card: the homepage cursor frames the whole card, not just the title link.
  return (
    <article className={styles.card} data-frame-card=''>
      <p className={cn(styles.meta, styles.dots)}>
        <span>{t(`categories.${card.category}`)}</span>
        <span>{languages}</span>
      </p>
      {/* Only a title in the other language needs its own lang, so screen readers switch voice for it. */}
      <Heading lang={card.lang === locale ? undefined : card.lang} className={styles.title}>
        <PostLink slug={card.slug} language={card.lang} className={styles.link}>
          {card.title}
        </PostLink>
      </Heading>
      <p lang={card.lang} className={styles.description}>
        {card.description}
      </p>
      <p className={styles.footer}>
        <span className={styles.dots}>
          <time dateTime={card.date}>{date}</time>
          {card.minutes !== null && <span>{t('card.minutes', { minutes: card.minutes })}</span>}
        </span>
        {/* The title link already says where the card goes; a second link would be read twice. */}
        <span aria-hidden='true' className={styles.read}>
          {t('card.read')} →
        </span>
      </p>
    </article>
  )
}

type ArticleCardListProps = Readonly<{ cards: readonly ArticleCardData[]; headingLevel: 2 | 3; className?: string }>

export const ArticleCardList = ({ cards, headingLevel, className }: ArticleCardListProps) => (
  <ul className={cn(styles.list, className)}>
    {cards.map(card => (
      <li key={card.slug}>
        <ArticleCard card={card} headingLevel={headingLevel} />
      </li>
    ))}
  </ul>
)

export default ArticleCard
