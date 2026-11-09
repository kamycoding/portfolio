import type { ReactNode } from 'react'

import type { Review } from '@/content/reviews'

import styles from './reviews.module.css'

type ReviewAvatarProps = Readonly<{
  kind: Review['avatar']
  accent: Review['accent']
}>

// Hair, hats and gear per character, drawn over the shared head.
const EXTRAS: Record<Review['avatar'], ReactNode> = {
  glasses: (
    <>
      <path
        className={styles.hair}
        d='M21.6 27 L24.5 23 L26.3 25.6 L29 21.6 L31.2 24.6 L34 21 L36.2 24 L39.4 21.2 L42.4 27 C43 14 21 14 21.6 27 Z'
      />
      <path d='M27 17.6 l-1.6 -3.6 M32 16.6 l0.4 -4 M37 17.6 l2 -3.2' strokeWidth='1.3' />
      <circle cx='27.5' cy='31' r='3.8' strokeWidth='1.3' />
      <circle cx='36.5' cy='31' r='3.8' strokeWidth='1.3' />
      <path d='M31.3 31 h1.4 M23.7 30.4 l-2.8 -0.8 M40.3 30.4 l2.8 -0.8' strokeWidth='1.3' />
    </>
  ),
  beanie: (
    <>
      <path className={styles.hair} d='M21 22.5 C21 15.5 26 12 32 12 C38 12 43 15.5 43 22.5 Z' />
      <circle className={styles.fill} cx='32' cy='10' r='2.6' />
      <rect className={styles.fill} x='19.5' y='22.5' width='25' height='5' rx='1.6' />
      <path d='M23.5 22.5 v5 M27.7 22.5 v5 M32 22.5 v5 M36.3 22.5 v5 M40.5 22.5 v5' strokeWidth='1' opacity='.55' />
    </>
  ),
  headphones: (
    <>
      <path
        className={styles.hair}
        d='M20.5 28 a3 3 0 0 1 0.5 -5 a3 3 0 0 1 3 -4.5 a3 3 0 0 1 4.5 -2.5 a3 3 0 0 1 3.5 -1 a3 3 0 0 1 3.5 1 a3 3 0 0 1 4.5 2.5 a3 3 0 0 1 3 4.5 a3 3 0 0 1 0.5 5 C42 22 22 22 20.5 28 Z'
      />
      <path d='M18.2 29 C17 6 47 6 45.8 29' strokeWidth='1.8' />
      <rect className={styles.fill} x='15.4' y='26.5' width='5.6' height='9.5' rx='2.6' />
      <rect className={styles.fill} x='43' y='26.5' width='5.6' height='9.5' rx='2.6' />
    </>
  )
}

// A generic hand-drawn character in the cat's stroke style, decorative because the name is shown as text.
const ReviewAvatar = ({ kind, accent }: ReviewAvatarProps) => (
  <span className={styles.avatar} data-accent={accent} aria-hidden='true'>
    <svg
      viewBox='4 3 56 56'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
      focusable='false'
    >
      <path className={styles.fill} d='M9 66 C11 51.5 21 46.5 32 46.5 C43 46.5 53 51.5 55 66' />
      <path d='M28.6 41.5 v5 M35.4 41.5 v5' />
      <path d='M27 46.8 q5 4 10 0' strokeWidth='1.2' opacity='.7' />
      <g className={styles.face}>
        <path className={styles.fill} d='M21.4 29.5 q-3 0 -3 3 q0 3 3 3 M42.6 29.5 q3 0 3 3 q0 3 -3 3' />
        <ellipse className={styles.fill} cx='32' cy='30' rx='11' ry='12.5' />
        <g className={styles.eyes}>
          <circle cx='27.5' cy='31' r='1.25' fill='currentColor' stroke='none' />
          <circle cx='36.5' cy='31' r='1.25' fill='currentColor' stroke='none' />
        </g>
        <path d='M29 36.6 q3 2.2 6 0' strokeWidth='1.3' />
        {EXTRAS[kind]}
      </g>
    </svg>
  </span>
)

export default ReviewAvatar
