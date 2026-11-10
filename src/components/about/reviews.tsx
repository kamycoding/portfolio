import type { ReactNode } from 'react'

import { getLocale, getTranslations } from 'next-intl/server'

import { HEADING_CLASS } from '@/components/shell/section'
import { REVIEWS } from '@/content/reviews'

import ReviewAvatar from './review-avatar'

import styles from './reviews.module.css'

const soft = (chunks: ReactNode) => <span className='text-muted'>{chunks}</span>

const CheckIcon = () => (
  <svg
    viewBox='0 0 16 16'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <path d='M3.5 8.5 l3 3 l6 -7' />
  </svg>
)

// Reviews as GitHub-style pull request reviews: a summary bar, then one approved review per reviewer.
const Reviews = async () => {
  const t = await getTranslations('about.reviews')
  const locale = (await getLocale()) === 'de' ? 'de' : 'en'
  const count = REVIEWS.length

  return (
    <div className={styles.reviews}>
      <p className='text-com mb-4.5 font-mono text-[13px]'>{t('eyebrow')}</p>
      <h2 className={HEADING_CLASS}>{t.rich('title', { soft, count })}</h2>

      <div className={styles.bar}>
        <span className={styles.barTitle}>
          <svg
            viewBox='0 0 16 16'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.4'
            strokeLinecap='round'
            aria-hidden='true'
          >
            <circle cx='4.5' cy='3.5' r='1.8' />
            <circle cx='4.5' cy='12.5' r='1.8' />
            <circle cx='11.5' cy='12.5' r='1.8' />
            <path d='M4.5 5.3 v5.4 M11.5 10.7 V7.5 a2 2 0 0 0 -2 -2 H7' />
          </svg>
          {t('header')}
          <span className={styles.counter}>{count}</span>
        </span>
        <span className={styles.barStatus}>
          <CheckIcon />
          {t('count', { count })}
          <span className={styles.barChanges}>· {t('changes')}</span>
        </span>
      </div>

      <div className={styles.list}>
        {REVIEWS.map(review => (
          <article key={review.name} className={styles.review} data-shell-ui='' data-frame=''>
            <header className={styles.top}>
              <ReviewAvatar kind={review.avatar} accent={review.accent} />
              <div className={styles.who}>
                {/* Named by the hidden text only, so screen readers do not hear the name twice. */}
                <a href={review.linkedin} target='_blank' rel='noopener noreferrer' className={styles.reviewer}>
                  <b aria-hidden='true'>{review.name}</b>
                  <span className='sr-only'>{t('linkedin', { name: review.name })}</span>
                  <span aria-hidden='true' className={styles.external}>
                    ↗
                  </span>
                </a>
                <span className={styles.role}>{review.role}</span>
                <span className={styles.context}>{t(review.context)}</span>
              </div>
            </header>
            <div className={styles.event}>
              <span className={styles.check}>
                <CheckIcon />
              </span>
              <span className={styles.eventText}>{t('approved')}</span>
              <span className={styles.badge}>{t('badge')}</span>
            </div>
            <blockquote className={styles.comment}>{review[locale]}</blockquote>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Reviews
