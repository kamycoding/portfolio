import type { ReactNode } from 'react'

import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

import styles from './blocks.module.css'

type CalloutProps = Readonly<{ type?: 'note' | 'tip' | 'warning'; title?: string; children: ReactNode }>

// The visible label names the kind, so the accent colour is never the only signal.
const Callout = ({ type = 'note', title, children }: CalloutProps) => {
  const t = useTranslations('journal.callout')

  return (
    <div role='note' className={cn(styles.callout, styles[type])}>
      <p className={styles.label}>
        <span className={styles.kind}>{t(type)}</span>
        {title && (
          <>
            <span className='sr-only'>: </span>
            <span className={styles.title}>{title}</span>
          </>
        )}
      </p>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export default Callout
