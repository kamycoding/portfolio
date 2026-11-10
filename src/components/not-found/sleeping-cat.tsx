import { CAT_OUTLINE } from '@/components/cat/cat-paths'
import { cn } from '@/lib/utils'

import styles from './not-found.module.css'

// The site's cat, asleep and static: no store, translations or motion, so it also works in the root 404.
const SleepingCat = () => (
  <svg
    className={styles.cat}
    viewBox='0 0 140 110'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.6'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <text className={styles.zz} x='62' y='20'>
      z
    </text>
    <text className={cn(styles.zz, styles.zzSmall)} x='71' y='11'>
      z
    </text>
    <path d={CAT_OUTLINE.tail} />
    <path className={styles.fill} d={CAT_OUTLINE.body} />
    <path className={styles.stripe} d='M78 41 q4 6 2 12 M90 43 q4 6 1 12 M101 48 q3 5 0 10' />
    <path d={CAT_OUTLINE.earLeft} />
    <path d={CAT_OUTLINE.earRight} />
    <path className={styles.fill} d={CAT_OUTLINE.head} />
    <path d='M25.5 22.5 l2.5 5 M53 22.5 l-2.5 5' strokeWidth='1.1' opacity='.6' />
    <path d='M27 43 q4 3 8 0 M43 43 q4 3 8 0' />
    <path d='M37.4 49 l1.6 1.7 l1.6 -1.7 Z' fill='currentColor' strokeWidth='1' />
    <path d='M39 50.8 q-1.8 2.8 -4 1.4 M39 50.8 q1.8 2.8 4 1.4' strokeWidth='1.2' />
    <path d='M22 50 l-11 -2.5 M22 53 l-11 1.5 M56 50 l11 -2.5 M56 53 l11 1.5' strokeWidth='1' opacity='.7' />
    <path className={styles.fill} d={CAT_OUTLINE.pawLeft} />
    <path className={styles.fill} d={CAT_OUTLINE.pawRight} />
    <path d='M32 73 v1.6 M35 73.6 v1.6 M47 73 v1.6 M50 73.6 v1.6' strokeWidth='1' opacity='.55' />
  </svg>
)

export default SleepingCat
