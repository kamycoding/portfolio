'use client'

import { type KeyboardEvent, useId, useRef, useState } from 'react'

import type { ContributionLevel } from '@/lib/contributions'
import { cn } from '@/lib/utils'

import styles from './stack.module.css'

type HeatmapProps = Readonly<{
  cells: readonly Readonly<{ level: ContributionLevel; tip: string; future: boolean }>[]
  months: readonly string[]
  days: readonly [mon: string, wed: string, fri: string]
  label: string
}>

const LEVEL_CLASS = [undefined, styles.l1, styles.l2, styles.l3, styles.l4] as const

// Arrow keys walk the grid: up and down by day, left and right by week.
const STEP: Readonly<Record<string, number>> = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }

// Contribution grid with the prototype's floating tooltip. Keyboard users get the same tooltip on the active day.
const Heatmap = ({ cells, months, days, label }: HeatmapProps) => {
  const id = useId()
  const gridRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(-1)

  // Positioned by hand like the prototype; the text stays while it fades out.
  const showTip = (cell: Element, text: string) => {
    const tip = tipRef.current

    if (!tip) return

    const box = cell.getBoundingClientRect()

    tip.textContent = text
    tip.style.opacity = '1'
    tip.style.left = `${Math.min(window.innerWidth - tip.offsetWidth - 8, box.left + box.width / 2 - tip.offsetWidth / 2)}px`
    tip.style.top = `${box.top - 30}px`
  }

  const hideTip = () => {
    if (tipRef.current) tipRef.current.style.opacity = '0'
  }

  const focusCell = (index: number) => {
    const cell = gridRef.current?.children[index]

    setActive(index)

    if (cell) showTip(cell, cells[index].tip)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Days after today are empty placeholders, so the keys stop at today.
    const last = cells.findLastIndex(cell => !cell.future)
    let next: number | undefined

    if (event.key in STEP) next = Math.min(last, Math.max(0, active + STEP[event.key]))
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last

    if (next === undefined) return

    event.preventDefault()
    focusCell(next)
  }

  // Keyboard focus starts on the first day with contributions; a mouse click keeps the hover tooltip instead.
  const onFocus = () => {
    if (!gridRef.current?.matches(':focus-visible')) return

    focusCell(
      active >= 0
        ? active
        : Math.max(
            0,
            cells.findIndex(cell => cell.level > 0)
          )
    )
  }

  return (
    <>
      <div className={styles.months} aria-hidden='true'>
        {months.map((month, week) => (
          <span key={week}>{month}</span>
        ))}
      </div>
      <div className={styles.heat}>
        <div className={styles.days} aria-hidden='true'>
          <span>{days[0]}</span>
          <span />
          <span>{days[1]}</span>
          <span />
          <span>{days[2]}</span>
          <span />
          <span />
        </div>
        <div
          ref={gridRef}
          role='listbox'
          tabIndex={0}
          aria-label={label}
          aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
          className={styles.cells}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={hideTip}
          onMouseOver={event => {
            const cell = (event.target as Element).closest('[role=option]')

            if (cell) showTip(cell, cell.getAttribute('aria-label') ?? '')
          }}
          onMouseLeave={hideTip}
        >
          {cells.map((cell, index) =>
            cell.future ? (
              <span key={index} aria-hidden='true' className={cn(styles.cell, styles.future)} />
            ) : (
              <span
                key={index}
                id={`${id}-${index}`}
                role='option'
                aria-selected={index === active}
                aria-label={cell.tip}
                className={cn(styles.cell, LEVEL_CLASS[cell.level], index === active && styles.active)}
              />
            )
          )}
        </div>
      </div>
      <span ref={tipRef} className={styles.tip} aria-hidden='true' />
    </>
  )
}

export default Heatmap
