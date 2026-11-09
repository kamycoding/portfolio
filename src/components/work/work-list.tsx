'use client'

import { type KeyboardEvent, type PointerEvent, useRef, useState } from 'react'

import { useLocale } from 'next-intl'

import { PROJECTS } from '@/content/projects'
import { ICON, INVERT_ON_DARK } from '@/content/stack'
import { prefersReducedMotion } from '@/lib/actions'
import { cn } from '@/lib/utils'

import Cover from './cover'
import ProjectDrawer from './project-drawer'

import styles from './work.module.css'

// The `ls -la projects/` rows, the cover that trails the pointer and the README drawer.
const WorkList = () => {
  const locale = useLocale() === 'de' ? 'de' : 'en'
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [closing, setClosing] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [previewShown, setPreviewShown] = useState(false)
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const opener = useRef<HTMLElement | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const follow = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, frame: 0, shown: false })

  // Eased follow (0.16 per frame) so the cover trails the pointer; reduced motion drops the lag.
  const step = () => {
    const state = follow.current
    const ease = prefersReducedMotion() ? 1 : 0.16

    state.x += (state.targetX - state.x) * ease
    state.y += (state.targetY - state.y) * ease

    if (previewRef.current) previewRef.current.style.transform = `translate3d(${state.x}px,${state.y}px,0)`

    state.frame = state.shown ? window.requestAnimationFrame(step) : 0
  }

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== 'mouse') return

    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-index]')

    if (!button) return

    const state = follow.current

    setPreviewIndex(Number(button.dataset.index))

    // Same placement as the prototype: right of the pointer, kept inside the viewport.
    state.targetX = Math.min(window.innerWidth - 360, event.clientX + 28)
    state.targetY = Math.min(window.innerHeight - 260, Math.max(90, event.clientY - 110))

    if (!state.shown) {
      state.x = state.targetX
      state.y = state.targetY
      state.shown = true
      setPreviewShown(true)
      window.cancelAnimationFrame(state.frame)
      state.frame = window.requestAnimationFrame(step)
    }
  }

  const hidePreview = () => {
    follow.current.shown = false
    setPreviewShown(false)
  }

  const open = (index: number, button: HTMLButtonElement) => {
    hidePreview()
    opener.current = button
    setClosing(false)
    setOpenIndex(index)
  }

  const close = () => {
    if (openIndex === null || closing) return

    const finish = () => {
      setOpenIndex(null)
      setClosing(false)
      opener.current?.focus()
    }

    if (prefersReducedMotion()) return finish()

    setClosing(true)
    window.setTimeout(finish, 240)
  }

  const stepDrawer = (direction: 1 | -1) =>
    setOpenIndex(index => (index === null ? index : (index + direction + PROJECTS.length) % PROJECTS.length))

  // Arrow keys move between rows, as in the prototype.
  const onRowKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    event.preventDefault()

    const next = (index + (event.key === 'ArrowDown' ? 1 : PROJECTS.length - 1)) % PROJECTS.length

    buttons.current[next]?.focus()
  }

  return (
    <>
      <ul className={styles.rows} onPointerMove={onPointerMove} onPointerLeave={hidePreview}>
        {PROJECTS.map((project, index) => {
          const copy = project[locale]

          return (
            <li
              key={project.id}
              className={styles.row}
              style={{ '--c': `var(--${project.accent})` } as React.CSSProperties}
            >
              <button
                ref={element => {
                  buttons.current[index] = element
                }}
                type='button'
                data-index={index}
                data-cover-lift=''
                aria-haspopup='dialog'
                className={styles.rowButton}
                onClick={event => open(index, event.currentTarget)}
                onKeyDown={event => onRowKeyDown(event, index)}
              >
                <span className={styles.perm}>drwxr-xr-x</span>
                <span className={styles.name}>
                  {project.id}
                  <i>/</i>
                </span>
                <span className={styles.what}>
                  <b>
                    {copy.context}, {project.year}
                  </b>
                  {copy.tag}
                </span>
                <span className={styles.meta}>
                  <span className={styles.icons}>
                    {project.stack
                      .slice(0, 4)
                      .map(name =>
                        ICON[name] ? (
                          <img
                            key={name}
                            src={`/stack/${ICON[name]}.svg`}
                            alt=''
                            width={16}
                            height={16}
                            className={cn(INVERT_ON_DARK.has(ICON[name]) && 'dark:invert')}
                          />
                        ) : null
                      )}
                  </span>
                  <span className={styles.status}>{copy.status}</span>
                </span>
                <span aria-hidden='true' className={styles.go}>
                  →
                </span>
                <span aria-hidden='true' className={styles.thumb}>
                  <Cover project={project} status={copy.status} />
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div ref={previewRef} aria-hidden='true' className={cn(styles.preview, previewShown && styles.previewShow)}>
        <Cover
          project={PROJECTS[previewIndex]}
          status={PROJECTS[previewIndex][locale].status}
          lift='always'
          className={styles.previewCover}
        />
      </div>

      {openIndex !== null && <ProjectDrawer index={openIndex} closing={closing} onStep={stepDrawer} onClose={close} />}
    </>
  )
}

export default WorkList
