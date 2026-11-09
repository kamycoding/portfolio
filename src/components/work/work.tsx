import { getTranslations } from 'next-intl/server'

import Section, { SectionHeading } from '@/components/shell/section'
import { PROJECTS } from '@/content/projects'

import WorkList from './work-list'

import styles from './work.module.css'

// work.tsx in the prototype: heading, then `ls -la projects/` with one row per project.
const Work = async () => {
  const t = await getTranslations('work')

  return (
    <Section id='work'>
      <SectionHeading id='work' intro={t('intro')} />

      <div className={styles.ls}>
        <div className={styles.lsHead}>
          <span>
            <span className={styles.dim}>$</span> ls -la projects/
          </span>
          <span className={`${styles.dim} ${styles.desktopOnly}`}>{t('lsHint')}</span>
        </div>
        <WorkList />
        <div className={styles.lsFoot}>
          <span className={styles.dim}>total {PROJECTS.length}</span>
          <span className={`${styles.dim} ${styles.desktopOnly}`}>↑ ↓ enter</span>
        </div>
      </div>
    </Section>
  )
}

export default Work
