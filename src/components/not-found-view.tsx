import type { RouteCandidate } from '@/lib/not-found'

import { MissingDetails, MissingTab } from './not-found/missing-path'
import SleepingCat from './not-found/sleeping-cat'
import styles from './not-found/not-found.module.css'

type NotFoundViewProps = Readonly<{
  copy: {
    code: string
    heading: string
    description: string
    navigationAria: string
    home: string
    projects: string
    journal: string
    suggestion: string
    fallback: string
  }
  homeHref: string
  journalHref: string
  candidates: readonly RouteCandidate[]
}>

const action = 'inline-flex h-11.5 items-center rounded-[10px] border px-5 text-[15px] font-medium'

// Shared by the localized 404 (inside the shell) and the root 404. The caller provides <main>.
const NotFoundView = ({ copy, homeHref, journalHref, candidates }: NotFoundViewProps) => (
  <div className={styles.view}>
    <div className={styles.window}>
      {/* The tab repeats the path that the error line states, so assistive technology reads it once. */}
      <div aria-hidden='true' className={styles.tabs}>
        <MissingTab />
      </div>
      <div className={styles.body}>
        <p className={styles.eyebrow}>{`// ${copy.code}`}</p>
        <h1 className={styles.heading}>{copy.heading}</h1>
        <MissingDetails
          candidates={candidates}
          suggestion={copy.suggestion}
          fallback={copy.fallback}
          homeHref={homeHref}
          journalHref={journalHref}
        />
        <p className={styles.description}>{copy.description}</p>
        <div className={styles.footer}>
          <nav aria-label={copy.navigationAria} className={styles.actions}>
            <a href={homeHref} className={`bg-text text-bg border-text ${action}`}>
              {copy.home}
            </a>
            <a href={`${homeHref}#work`} className={`border-hair-2 hover:border-hair-3 ${action}`}>
              {copy.projects}
            </a>
            <a href={journalHref} className={`border-hair-2 hover:border-hair-3 ${action}`}>
              {copy.journal}
            </a>
          </nav>
          <SleepingCat />
        </div>
      </div>
    </div>
  </div>
)

export default NotFoundView
