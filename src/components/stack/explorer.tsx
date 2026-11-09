'use client'

import { type KeyboardEvent, useId, useState } from 'react'

import { useTranslations } from 'next-intl'

import editor from '@/components/ui/editor.module.css'
import { FILE, ICON, INVERT_ON_DARK, STACK } from '@/content/stack'
import { cn } from '@/lib/utils'

import styles from './stack.module.css'

type Group = keyof typeof STACK

const GROUPS = Object.keys(STACK) as Group[]

const FIRST = Object.fromEntries(GROUPS.map(group => [group, 0])) as Record<Group, number>

// The stack as a VS Code explorer: groups are folders, technologies are files (ADR 0003 editor design).
const Explorer = () => {
  const t = useTranslations('stack.explorer')
  const id = useId()
  const [closed, setClosed] = useState<ReadonlySet<Group>>(new Set())
  const [active, setActive] = useState<Readonly<Record<Group, number>>>(FIRST)

  const toggle = (group: Group) =>
    setClosed(current => {
      const next = new Set(current)

      if (!next.delete(group)) next.add(group)

      return next
    })

  // Roving tabindex: each folder's files are one tab stop, the arrow keys move inside it.
  const onKeyDown = (group: Group, event: KeyboardEvent<HTMLUListElement>) => {
    const last = STACK[group].length - 1
    const current = active[group]

    const targets: Partial<Record<string, number>> = {
      ArrowDown: Math.min(last, current + 1),
      ArrowUp: Math.max(0, current - 1),
      Home: 0,
      End: last
    }

    const next = targets[event.key]

    if (next === undefined) return

    event.preventDefault()
    setActive(state => ({ ...state, [group]: next }))
    ;(event.currentTarget.children[next] as HTMLElement | undefined)?.focus()
  }

  return (
    <div className={editor.editor} data-shell-ui=''>
      <div className={editor.edHead}>
        <div className={cn(editor.edTab, styles.exTitle)}>{t('title')}</div>
        <div className={editor.edPath}>{t('hint')}</div>
      </div>
      <div className={styles.explorer}>
        {GROUPS.map(group => {
          const items = STACK[group]
          const open = !closed.has(group)
          const listId = `${id}-${group}`

          return (
            <div key={group} className={cn(styles.folder, group === 'learning' && styles.learning)}>
              <button
                type='button'
                className={styles.folderRow}
                data-cursor='fold'
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => toggle(group)}
              >
                <span className={styles.chevron} aria-hidden='true'>
                  ▾
                </span>
                {group}/{' '}
                <span className={styles.count}>
                  {items.length}
                  <span className='sr-only'> {t('files', { count: items.length })}</span>
                </span>
              </button>
              <ul id={listId} hidden={!open} className={styles.files} onKeyDown={event => onKeyDown(group, event)}>
                {items.map((name, index) => (
                  <li
                    key={name}
                    tabIndex={index === active[group] ? 0 : -1}
                    aria-label={t('file', { name, file: FILE[name] })}
                    className={styles.file}
                    onFocus={() => setActive(state => ({ ...state, [group]: index }))}
                  >
                    <img
                      src={`/stack/${ICON[name]}.svg`}
                      loading='lazy'
                      alt=''
                      width={14}
                      height={14}
                      className={cn(INVERT_ON_DARK.has(ICON[name]) && 'dark:invert')}
                    />
                    <span className={styles.fileName}>{FILE[name]}</span>
                    <span className={styles.tech} aria-hidden='true'>
                      {name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Explorer
