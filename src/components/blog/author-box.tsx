import { useTranslations } from 'next-intl'

import Logo from '@/components/brand/logo'
import { AUTHOR_NAME, PROFILES } from '@/lib/site'

import styles from './blog.module.css'

// The article's own footer: only what the site already says about its author, never more.
const AuthorBox = () => {
  const t = useTranslations('journal.author')

  return (
    <footer className={styles.author}>
      <span className={styles.authorMark}>
        <Logo height={34} />
      </span>
      <address className={styles.authorText}>
        <p className={styles.authorLabel}>{t('label')}</p>
        <p className={styles.authorName}>{AUTHOR_NAME}</p>
        <p className={styles.authorRole}>{t('role')}</p>
        <p className={styles.authorLinks}>
          <a href={PROFILES.github} target='_blank' rel='noopener noreferrer'>
            GitHub
          </a>
          <a href={PROFILES.linkedin} target='_blank' rel='noopener noreferrer'>
            LinkedIn
          </a>
        </p>
      </address>
    </footer>
  )
}

export default AuthorBox
