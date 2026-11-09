'use client'

import { type KeyboardEvent, useEffect, useId, useRef } from 'react'

import { useLocale, useTranslations } from 'next-intl'

import ui from '@/components/ui/ui.module.css'
import { PROJECTS } from '@/content/projects'
import { ICON, INVERT_ON_DARK } from '@/content/stack'
import { cn } from '@/lib/utils'

import Cover from './cover'

import styles from './work.module.css'

type ProjectDrawerProps = Readonly<{
  index: number
  closing: boolean
  onStep: (direction: 1 | -1) => void
  onClose: () => void
}>

// The project README as a side panel (prototype "peek drawer").
const ProjectDrawer = ({ index, closing, onStep, onClose }: ProjectDrawerProps) => {
  const t = useTranslations('work')
  const locale = useLocale() === 'de' ? 'de' : 'en'
  const panelRef = useRef<HTMLElement>(null)
  const titleId = useId()
  const project = PROJECTS[index]
  const copy = project[locale]

  // Focus moves into the dialog and the page behind it stops scrolling.
  useEffect(() => {
    panelRef.current?.focus()

    const previous = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      onStep(1)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      onStep(-1)
    } else if (event.key === 'Tab') {
      // Keep keyboard focus inside the dialog.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>('a, button')

      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  // The wrapper only forwards keyboard shortcuts; every control inside is a real button or link.
  return (
    <div className={cn(styles.drawer, closing && styles.closing)} onKeyDown={onKeyDown}>
      <div className={styles.scrim} onClick={onClose} aria-hidden='true' />
      <aside
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        tabIndex={-1}
        className={styles.panel}
      >
        <div className={styles.head}>
          <div className={styles.fileTab}>
            <span className={styles.badge}>MD</span>
            <span>{project.id}/README.md</span>
          </div>
          <div className={styles.nav}>
            <span className={styles.position}>
              {index + 1} / {PROJECTS.length}
            </span>
            <button type='button' className={ui.chip} aria-label={t('drawer.prev')} onClick={() => onStep(-1)}>
              ↑
            </button>
            <button type='button' className={ui.chip} aria-label={t('drawer.next')} onClick={() => onStep(1)}>
              ↓
            </button>
            <button type='button' className={ui.chip} aria-label={t('drawer.close')} onClick={onClose}>
              esc
            </button>
          </div>
        </div>

        {/* The key re-mounts the content on every step, which replays the fade-in and resets the scroll. */}
        <div key={index} className={styles.body}>
          <Cover
            project={project}
            status={copy.status}
            label={`${copy.title}, ${t('drawing')}`}
            lift='hover'
            className={styles.drawerCover}
          />
          <div>
            <h3 id={titleId} className={styles.title}>
              {copy.title}. <span>{copy.tag}</span>
            </h3>
            <p className={styles.desc}>{copy.desc}</p>
          </div>
          <dl className={styles.kv}>
            <div>
              <dt>{t('labels.role')}</dt>
              <dd>{copy.role}</dd>
            </div>
            <div>
              <dt>{t('labels.time')}</dt>
              <dd>{copy.time}</dd>
            </div>
            <div>
              <dt>{t('labels.context')}</dt>
              <dd>{copy.context}</dd>
            </div>
            <div>
              <dt>{t('labels.status')}</dt>
              <dd>{copy.status}</dd>
            </div>
          </dl>
          <div className={styles.notes}>
            {copy.notes.map(([heading, text]) => (
              <div key={heading}>
                <h4>{`// ${heading}`}</h4>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className={styles.stackRow}>
            {project.stack.map(name => (
              <span key={name} className={ui.pill}>
                {ICON[name] && (
                  <img
                    src={`/stack/${ICON[name]}.svg`}
                    loading='lazy'
                    alt=''
                    width={14}
                    height={14}
                    className={cn(INVERT_ON_DARK.has(ICON[name]) && 'dark:invert')}
                  />
                )}
                {name}
              </span>
            ))}
          </div>
          <div className={styles.links}>
            {project.links.map(([kind, url]) => (
              <a
                key={kind}
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(ui.btn, ui.small, kind === 'live' && ui.primary)}
              >
                {t(`links.${kind}`)} ↗
              </a>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

export default ProjectDrawer
