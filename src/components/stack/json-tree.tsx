'use client'

import { type ReactNode, useState } from 'react'

import { useTranslations } from 'next-intl'

import { ICON, INVERT_ON_DARK, STACK } from '@/content/stack'
import { cn } from '@/lib/utils'

import styles from './stack.module.css'

type Group = keyof typeof STACK

const GROUPS = Object.keys(STACK) as Group[]

const Line = ({ n, className, children }: Readonly<{ n: number; className?: string; children: ReactNode }>) => (
  <div className={cn(styles.ln, className)}>
    <span className={styles.n}>{n}</span>
    <span>{children}</span>
  </div>
)

// stack.json with foldable groups. Folded lines keep their numbers, as in the prototype.
const JsonTree = () => {
  const t = useTranslations('stack')
  const [folded, setFolded] = useState<ReadonlySet<Group>>(new Set())
  let n = 1

  const toggle = (group: Group) =>
    setFolded(current => {
      const next = new Set(current)

      if (!next.delete(group)) next.add(group)

      return next
    })

  return (
    <div className={styles.json}>
      <Line n={n++}>{'{'}</Line>
      {GROUPS.map((group, groupIndex) => {
        const items = STACK[group]
        const closed = folded.has(group)
        const comma = groupIndex < GROUPS.length - 1 ? ',' : ''

        return (
          <div key={group} className={cn(closed && styles.closed)}>
            <Line n={n++}>
              {'  '}
              <button
                type='button'
                className={styles.toggle}
                data-cursor='fold'
                aria-expanded={!closed}
                aria-label={t('foldGroup', { group })}
                onClick={() => toggle(group)}
              >
                ▾
              </button>
              <span className={styles.prop}>&quot;{group}&quot;</span>
              <span className={styles.pun}>:</span> [
              <span className={styles.more}>
                {' '}
                {items.length} items ]{comma}
              </span>
            </Line>
            <div className={styles.items}>
              {items.map((name, index) => (
                <Line key={name} n={n++} className={cn(styles.item, group === 'learning' && styles.learning)}>
                  {'      '}
                  <img
                    src={`/stack/${ICON[name]}.svg`}
                    loading='lazy'
                    alt=''
                    width={14}
                    height={14}
                    className={cn(INVERT_ON_DARK.has(ICON[name]) && 'dark:invert')}
                  />
                  <span className={styles.str}>&quot;{name}&quot;</span>
                  {index < items.length - 1 ? ',' : ''}
                </Line>
              ))}
              <Line n={n++}>
                {'    ]'}
                {comma}
              </Line>
            </div>
          </div>
        )
      })}
      <Line n={n++}>{'}'}</Line>
    </div>
  )
}

export default JsonTree
