import { type ReactNode, useId } from 'react'

import { useTranslations } from 'next-intl'

import styles from './blocks.module.css'

type SummaryProps = Readonly<{ children: ReactNode }>

// A labelled region rather than a heading, so the Outline and the heading levels stay as the author wrote them.
const Summary = ({ label, children }: SummaryProps & Readonly<{ label: string }>) => {
  const id = useId()

  return (
    <section aria-labelledby={id} className={styles.summary}>
      <p id={id} className={styles.summaryLabel}>
        {label}
      </p>
      <div className={styles.body}>{children}</div>
    </section>
  )
}

export const TLDR = ({ children }: SummaryProps) => {
  const t = useTranslations('journal')

  return <Summary label={t('tldr')}>{children}</Summary>
}

export const Takeaways = ({ children }: SummaryProps) => {
  const t = useTranslations('journal')

  return <Summary label={t('takeaways')}>{children}</Summary>
}
