'use client'

import { type RefObject, useEffect, useId, useState } from 'react'

import { useTranslations } from 'next-intl'

import { CAT_OUTLINE, CAT_VIEWBOX_WIDTH } from '@/components/cat/cat-paths'
import { sheetLabel } from '@/lib/blueprint'
import { SECTIONS } from '@/lib/sections'

import styles from './hero.module.css'

type Box = Readonly<{ x: number; y: number; w: number; h: number }>

type Layout = Readonly<{
  w: number
  h: number
  tabs: Box[]
  head: Box
  code: Box
  lines: Box[]
  foot: Box
  term: Box
  termHead: Box
  cat: Box | null
}>

type BlueprintProps = Readonly<{
  frameRef: RefObject<HTMLDivElement | null>
  buildDate: string

  // Changes when the code text changes (other file, cat awake), so the code lines are measured again.
  contentKey: string
}>

// Layout offsets ignore the tilt transform, so the drawing matches the untilted editor it is drawn on.
const box = (element: HTMLElement | null): Box =>
  element
    ? { x: element.offsetLeft, y: element.offsetTop, w: element.offsetWidth, h: element.offsetHeight }
    : { x: 0, y: 0, w: 0, h: 0 }

const measure = (frame: HTMLElement): Layout => {
  const find = (selector: string) => frame.querySelector<HTMLElement>(selector)

  return {
    w: frame.offsetWidth,
    h: frame.offsetHeight,
    tabs: [...frame.querySelectorAll<HTMLElement>('[role="tab"]')].map(box),
    head: box(find('[data-bp="head"]')),
    code: box(find('[data-bp="code"]')),
    lines: [...frame.querySelectorAll<HTMLElement>('[data-line] > span:last-child')].map(box),
    foot: box(find('[data-bp="foot"]')),
    term: box(find('[data-bp="terminal"]')),
    termHead: box(find('[data-bp="terminal"] > :first-child')),
    cat: find(`.${styles.cat}`) ? box(find(`.${styles.cat}`)) : null
  }
}

type DimProps = Readonly<{
  x1: number
  y1: number
  x2: number
  y2: number
  label: number
  marker: string
}>

// A dimension line with arrowheads and its measured value in px, written along the line.
const Dim = ({ x1, y1, x2, y2, label, marker }: DimProps) => {
  const vertical = x1 === x2
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2

  return (
    <g className={styles.bpDim}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} markerStart={`url(#${marker})`} markerEnd={`url(#${marker})`} />
      <text
        x={vertical ? mx - 5 : mx}
        y={vertical ? my : my - 5}
        textAnchor='middle'
        transform={vertical ? `rotate(-90 ${mx - 5} ${my})` : undefined}
      >
        {Math.round(label)}
      </text>
    </g>
  )
}

// The editor, terminal and cat as a technical drawing, derived from the real layout. Decorative only.
const Blueprint = ({ frameRef, buildDate, contentKey }: BlueprintProps) => {
  const t = useTranslations('hero.blueprint')
  const [layout, setLayout] = useState<Layout | null>(null)

  // React ids can contain characters that break url(#id) references.
  const marker = `bp${useId().replace(/[^\w-]/g, '')}`

  useEffect(() => {
    const frame = frameRef.current

    if (!frame) return

    const update = () => setLayout(measure(frame))

    // Fires once on observe, then on every size change of the editor or its code panel.
    const observer = new ResizeObserver(update)

    observer.observe(frame)

    const code = frame.querySelector('[data-bp="code"]')

    if (code) observer.observe(code)

    // Code line widths change when the mono font arrives, without resizing the editor.
    void document.fonts?.ready.then(update)

    return () => observer.disconnect()
  }, [frameRef, contentKey])

  if (!layout) return <div aria-hidden='true' className={styles.blueprint} />

  const { w, h, head, code, lines, foot, term, termHead, cat } = layout
  const chainX = w - 18

  const sheet = sheetLabel(
    SECTIONS.findIndex(section => section.id === 'index'),
    SECTIONS.length
  )

  const block = { w: 216, h: 58 }
  const bx = Math.max(12, w - block.w - 34)
  const by = h - block.h - 12

  return (
    <div aria-hidden='true' className={styles.blueprint}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={styles.bpSvg}>
        <defs>
          <marker
            id={marker}
            viewBox='0 0 8 8'
            refX='4'
            refY='4'
            markerWidth='8'
            markerHeight='8'
            orient='auto-start-reverse'
          >
            <path d='M0 1 L8 4 L0 7' className={styles.bpArrow} />
          </marker>
        </defs>

        {/* Frame, tab bar, code panel, footer and terminal, all from the measured boxes. */}
        <g className={styles.bpLine}>
          <rect x={0.5} y={0.5} width={w - 1} height={h - 1} rx={14} className={styles.bpPaper} />
          <line x1={0} y1={head.y + head.h} x2={w} y2={head.y + head.h} />
          {layout.tabs.map((tab, index) => (
            <line key={index} x1={tab.x + tab.w} y1={tab.y} x2={tab.x + tab.w} y2={tab.y + tab.h} />
          ))}
          {lines[0] && (
            <line
              x1={lines[0].x - 8}
              y1={code.y + 8}
              x2={lines[0].x - 8}
              y2={code.y + code.h - 8}
              className={styles.bpHidden}
            />
          )}
          <line x1={0} y1={foot.y} x2={w} y2={foot.y} />
          <line x1={0} y1={term.y} x2={w} y2={term.y} />
          <line x1={0} y1={termHead.y + termHead.h} x2={w} y2={termHead.y + termHead.h} />
        </g>

        {/* One stroke per code line, as long as the real text. */}
        <g className={styles.bpCode}>
          {lines.map((line, index) =>
            line.w > 10 ? (
              <line key={index} x1={line.x} y1={line.y + line.h / 2} x2={line.x + line.w} y2={line.y + line.h / 2} />
            ) : null
          )}
        </g>

        {cat && (
          <g className={styles.bpLine} transform={`translate(${cat.x} ${cat.y}) scale(${cat.w / CAT_VIEWBOX_WIDTH})`}>
            {Object.values(CAT_OUTLINE).map(d => (
              <path key={d} d={d} className={styles.bpCat} />
            ))}
          </g>
        )}

        {/* Chain of heights on the right, overall width below, cat width above it. */}
        <Dim x1={chainX} y1={0} x2={chainX} y2={head.h} label={head.h} marker={marker} />
        <Dim x1={chainX} y1={code.y} x2={chainX} y2={code.y + code.h} label={code.h} marker={marker} />
        <Dim x1={chainX} y1={term.y} x2={chainX} y2={term.y + term.h} label={term.h} marker={marker} />
        <g className={styles.bpExt}>
          <line x1={0} y1={h + 6} x2={0} y2={h + 30} />
          <line x1={w} y1={h + 6} x2={w} y2={h + 30} />
        </g>
        <Dim x1={0} y1={h + 24} x2={w} y2={h + 24} label={w} marker={marker} />
        {cat && <Dim x1={cat.x} y1={cat.y - 8} x2={cat.x + cat.w} y2={cat.y - 8} label={cat.w} marker={marker} />}

        {/* Title block, as on an architectural sheet. */}
        <g className={styles.bpBlock} transform={`translate(${bx} ${by})`}>
          <rect width={block.w} height={block.h} />
          <line x1={0} y1={26} x2={block.w} y2={26} />
          <line x1={58} y1={26} x2={58} y2={block.h} />
          <line x1={124} y1={26} x2={124} y2={block.h} />
          <text x={8} y={11} className={styles.bpLabel}>
            {t('project')}
          </text>
          <text x={8} y={21}>
            kamycoding.com
          </text>
          <text x={8} y={37} className={styles.bpLabel}>
            {t('scale')}
          </text>
          <text x={8} y={50}>
            1:1
          </text>
          <text x={66} y={37} className={styles.bpLabel}>
            {t('sheet')}
          </text>
          <text x={66} y={50}>
            {sheet}
          </text>
          <text x={132} y={37} className={styles.bpLabel}>
            {t('date')}
          </text>
          <text x={132} y={50}>
            {buildDate}
          </text>
        </g>
      </svg>
    </div>
  )
}

export default Blueprint
