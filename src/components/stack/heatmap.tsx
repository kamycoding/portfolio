'use client'

import { type CSSProperties, type KeyboardEvent, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import { prefersReducedMotion } from '@/lib/actions'
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

// Room for the sticky day labels when a focused cell is scrolled into view.
const DAY_LABELS_PX = 32

// Contribution grid with the prototype's floating tooltip. Keyboard users get the same tooltip on the active day.
const Heatmap = ({ cells, months, days, label }: HeatmapProps) => {
  const id = useId()
  const scrollRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(-1)

  // Server HTML shows every cell; the wave only hides them once JS knows the grid is still off screen.
  const [reveal, setReveal] = useState<'idle' | 'pending' | 'play'>('idle')
  const today = cells.findLastIndex(cell => !cell.future)

  // On narrow screens the grid scrolls inside its block; start at the latest weeks, like GitHub.
  useLayoutEffect(() => {
    const scroller = scrollRef.current

    if (scroller) scroller.scrollLeft = scroller.scrollWidth
  }, [])

  useEffect(() => {
    const grid = gridRef.current

    if (!grid || prefersReducedMotion()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setReveal('pending')

          return
        }

        setReveal('play')
        observer.disconnect()
      },
      { threshold: 0.3 }
    )

    observer.observe(grid)

    return () => observer.disconnect()
  }, [])

  // Positioned by hand like the prototype; the text stays while it fades out.
  const showTip = (cell: Element, text: string) => {
    const tip = tipRef.current

    if (!tip) return

    const box = cell.getBoundingClientRect()

    tip.textContent = text
    tip.style.opacity = '1'
    tip.style.left = `${Math.max(8, Math.min(window.innerWidth - tip.offsetWidth - 8, box.left + box.width / 2 - tip.offsetWidth / 2))}px`
    tip.style.top = `${box.top - 30}px`
  }

  const hideTip = () => {
    if (tipRef.current) tipRef.current.style.opacity = '0'
  }

  // Scrolls only the grid's own block, never the page, so the tooltip lands on the cell.
  const keepInView = (cell: Element) => {
    const scroller = scrollRef.current

    if (!scroller) return

    const box = cell.getBoundingClientRect()
    const port = scroller.getBoundingClientRect()

    if (box.left < port.left + DAY_LABELS_PX) scroller.scrollLeft -= port.left + DAY_LABELS_PX - box.left
    else if (box.right > port.right) scroller.scrollLeft += box.right - port.right
  }

  const focusCell = (index: number) => {
    const cell = gridRef.current?.children[index]

    setActive(index)

    if (!cell) return

    keepInView(cell)
    showTip(cell, cells[index].tip)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Days after today are empty placeholders, so the keys stop at today.
    let next: number | undefined

    if (event.key in STEP) next = Math.min(today, Math.max(0, active + STEP[event.key]))
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = today

    if (next === undefined) return

    event.preventDefault()
    focusCell(next)
  }

  // Keyboard focus starts on the latest day with contributions; a mouse click keeps the hover tooltip instead.
  const onFocus = () => {
    if (!gridRef.current?.matches(':focus-visible')) return

    focusCell(
      active >= 0
        ? active
        : Math.max(
            0,
            cells.findLastIndex(cell => cell.level > 0)
          )
    )
  }

  return (
    <div ref={scrollRef} className={styles.heatScroll} data-heat-scroll='' onScroll={hideTip}>
      <div className={styles.heatInner} style={{ '--weeks': months.length } as CSSProperties}>
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
            className={cn(styles.cells, reveal === 'pending' && styles.pending, reveal === 'play' && styles.play)}
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
                  className={cn(
                    styles.cell,
                    LEVEL_CLASS[cell.level],
                    index === active && styles.active,
                    index === today && styles.today
                  )}
                  style={{ '--i': index } as CSSProperties}
                />
              )
            )}
          </div>
        </div>
      </div>
      <span ref={tipRef} className={styles.tip} aria-hidden='true' />
    </div>
  )
}

export default Heatmap
