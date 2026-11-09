import type { CSSProperties } from 'react'

import type { Project } from '@/content/projects'
import { cn } from '@/lib/utils'

import DesignerArt from './covers/designer-art'
import HeldioArt from './covers/heldio-art'
import JoinArt from './covers/join-art'
import PolloArt from './covers/pollo-art'

import styles from './cover.module.css'

const ART: Record<Project['art'], () => React.JSX.Element> = {
  heldio: HeldioArt,
  join: JoinArt,
  designer: DesignerArt,
  pollo: PolloArt
}

type CoverProps = Readonly<{
  project: Project
  status: string

  // Accessible name for the drawing. Without it the cover is decorative (list and preview).
  label?: string
  lift?: 'always' | 'hover'
  className?: string
}>

// One cover for the list, the hover preview and the drawer, so every project is framed the same way.
const Cover = ({ project, status, label, lift, className }: CoverProps) => {
  const Art = ART[project.art]

  return (
    <div
      className={cn(
        styles.cover,
        lift === 'always' && styles.lifted,
        lift === 'hover' && styles.liftOnHover,
        className
      )}
      style={{ '--c': `var(--${project.accent})` } as CSSProperties}
    >
      <span className={cn(styles.mark, styles.tl)} />
      <span className={cn(styles.mark, styles.tr)} />
      <span className={cn(styles.mark, styles.bl)} />
      <span className={cn(styles.mark, styles.br)} />
      <span className={styles.label}>
        <i />
        ~/projects/{project.id}
      </span>
      <span className={styles.status}>{status}</span>
      <span className={styles.dim}>
        <span>{project.size}</span>
      </span>
      <div className={styles.win}>
        <div className={styles.bar}>
          <span className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.url}>
            <svg viewBox='0 0 10 10' fill='none' stroke='currentColor' strokeWidth='1.2' aria-hidden='true'>
              <rect x='2' y='4.5' width='6' height='4.5' rx='1' />
              <path d='M3.5 4.5V3a1.5 1.5 0 0 1 3 0v1.5' />
            </svg>
            {project.url}
          </span>
          <span className='w-6' />
        </div>
        <svg
          className={styles.art}
          viewBox='0 0 640 360'
          preserveAspectRatio='xMidYMin meet'
          {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
        >
          <Art />
        </svg>
      </div>
    </div>
  )
}

export default Cover
