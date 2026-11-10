'use client'

import { useEffect, useRef } from 'react'

import { useReadingRoute } from '@/hooks/use-reading-route'
import { getLineNumber } from '@/lib/scroll-spy'

import styles from './cursor.module.css'

/*
 * A drafting-tool cursor for the homepage, matching the blueprint hero (docs/design/DESIGN.md): a thin crosshair with
 * live coordinates, a corner-bracket selection frame with the measured size over anything clickable, an editor caret
 * with the line number over text, a block over the terminal, a paw near the cat, a measuring line when you drag on
 * empty space and a "+" pin when you click there. Journal pages keep their calm reading cursor.
 *
 * One requestAnimationFrame loop writes transforms only. Element rects are cached per scroll/resize epoch.
 */

// Everything a click does something on gets a selection frame; the cat and text fields have their own states.
const FRAME =
  'a[href], button, [role="button"], [role="option"], summary, [data-frame], [data-cursor]:not([data-cursor="text"]):not([data-cursor="pet"])'

const TEXT =
  'p, h1, h2, h3, h4, h5, h6, li, blockquote, dt, dd, figcaption, pre, code, input:not([type=checkbox]), textarea, [contenteditable], [data-cursor="text"]'

const CAT = '[data-cursor="pet"]'

// Journal pages: a ring over these, an editor caret over prose, a dot elsewhere.
const READING_TARGETS = 'a, button, summary, label, [role="button"], [role="option"]'
const PROSE = 'p, li, h1, h2, h3, h4, h5, h6, blockquote, pre, code, figcaption, dt, dd'

const NEAR_CAT = 44
const IDLE_MS = 3000
const DRAG_MIN = 4
const PULL_MAX = 4
const OUTSET = 3
const CORNER = 8

// Only real controls get pulled, not card-sized buttons such as the project rows.
const PULL_WIDTH = 280
const PULL_HEIGHT = 64

type Kind = 'cross' | 'frame' | 'text' | 'block' | 'paw'

type Rect = Readonly<{ x: number; y: number; w: number; h: number }>

type Pull = { x: number; y: number; tx: number; ty: number }

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

const readPx = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0

const Cursor = () => {
  const root = useRef<HTMLDivElement>(null)
  const cross = useRef<HTMLSpanElement>(null)
  const tag = useRef<HTMLSpanElement>(null)
  const tagText = useRef<HTMLSpanElement>(null)
  const caret = useRef<HTMLSpanElement>(null)
  const block = useRef<HTMLSpanElement>(null)
  const paw = useRef<HTMLSpanElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  const ring = useRef<HTMLSpanElement>(null)
  const corners = useRef<(HTMLSpanElement | null)[]>([])
  const sizeTag = useRef<HTMLSpanElement>(null)
  const sizeText = useRef<HTMLSpanElement>(null)
  const line = useRef<HTMLSpanElement>(null)
  const origin = useRef<HTMLSpanElement>(null)
  const distTag = useRef<HTMLSpanElement>(null)
  const distText = useRef<HTMLSpanElement>(null)
  const pins = useRef<(HTMLSpanElement | null)[]>([])
  const { reading } = useReadingRoute()

  useEffect(() => {
    const host = root.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!host || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const html = document.documentElement

    const nodes = {
      cross: cross.current!,
      tag: tag.current!,
      tagText: tagText.current!,
      caret: caret.current!,
      block: block.current!,
      paw: paw.current!,
      dot: dot.current!,
      ring: ring.current!,
      corners: corners.current as HTMLSpanElement[],
      sizeTag: sizeTag.current!,
      sizeText: sizeText.current!,
      line: line.current!,
      origin: origin.current!,
      distTag: distTag.current!,
      distText: distText.current!,
      pins: pins.current as HTMLSpanElement[]
    }

    let x = -100
    let y = -100
    let visible = false
    let kind: Kind = 'cross'
    let target: HTMLElement | null = null
    let readingMode = false
    let epoch = 0
    let retargetNext = false
    let lastMove = performance.now()
    let idle = false
    let frame = 0
    let down: { x: number; y: number; empty: boolean } | null = null
    let measuring = false
    let pinIndex = 0
    let ruler = 0
    let top = 0
    let cats: HTMLElement[] = []
    let catsEpoch = -1

    const rects = new WeakMap<Element, { epoch: number; rect: Rect }>()
    const pulls = new Map<HTMLElement, Pull>()
    const shape = { x: 0, y: 0, w: 0, h: 0, shown: false }
    const last = new WeakMap<HTMLElement, string>()
    const texts = new WeakMap<HTMLElement, string>()

    // Transforms only, and only when the value changed.
    const place = (element: HTMLElement, px: number, py: number, extra = '') => {
      const value = `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0)${extra}`

      if (last.get(element) === value) return

      last.set(element, value)
      element.style.transform = value
    }

    const write = (element: HTMLElement, text: string) => {
      if (texts.get(element) === text) return

      texts.set(element, text)
      element.textContent = text
    }

    // Rects are measured once per epoch (a scroll or resize), minus the pull the element currently has.
    const rectOf = (element: Element): Rect => {
      const cached = rects.get(element)

      if (cached && cached.epoch === epoch) return cached.rect

      const box = element.getBoundingClientRect()
      const pull = element instanceof HTMLElement ? pulls.get(element) : undefined
      const rect = { x: box.left - (pull?.x ?? 0), y: box.top - (pull?.y ?? 0), w: box.width, h: box.height }

      rects.set(element, { epoch, rect })

      return rect
    }

    const nearCat = () => {
      if (catsEpoch !== epoch) {
        cats = [...document.querySelectorAll<HTMLElement>(CAT)]
        catsEpoch = epoch
      }

      return cats.some(cat => {
        const rect = rectOf(cat)

        return (
          x > rect.x - NEAR_CAT &&
          x < rect.x + rect.w + NEAR_CAT &&
          y > rect.y - NEAR_CAT &&
          y < rect.y + rect.h + NEAR_CAT
        )
      })
    }

    const canPull = (element: HTMLElement) => {
      if (reduce.matches || !element.matches('button, [role="button"]')) return false

      const rect = rectOf(element)

      return rect.w <= PULL_WIDTH && rect.h <= PULL_HEIGHT
    }

    const setKind = (next: Kind) => {
      kind = next
      host.dataset.kind = next
    }

    const retarget = (element: Element | null) => {
      if (readingMode) {
        const control = element?.closest(READING_TARGETS)

        host.classList.toggle(styles.link, Boolean(control))
        host.classList.toggle(styles.text, !control && Boolean(element?.closest(PROSE)))

        return
      }

      let next: Kind = 'cross'
      let frameTarget: HTMLElement | null = null

      if (nearCat()) {
        next = 'paw'
      } else if (element) {
        const framed = element.closest<HTMLElement>(FRAME)

        if (framed) {
          next = 'frame'
          frameTarget = framed
        } else if (element.closest('[data-bp="terminal"]')) {
          next = 'block'
        } else if (element.closest(TEXT)) {
          next = 'text'
        }
      }

      if (next !== kind) setKind(next)

      if (frameTarget !== target) {
        // The element that is left settles back; the new one may start to be pulled.
        pulls.forEach(pull => {
          pull.tx = 0
          pull.ty = 0
        })

        if (frameTarget && canPull(frameTarget) && !pulls.has(frameTarget)) {
          pulls.set(frameTarget, { x: 0, y: 0, tx: 0, ty: 0 })
        }

        if (frameTarget && !target) shape.shown = false

        target = frameTarget
      }
    }

    const setMode = (isReading: boolean) => {
      readingMode = isReading
      host.classList.toggle(styles.reading, isReading)

      if (isReading) {
        host.dataset.kind = ''
        pulls.forEach((pull, element) => {
          element.style.translate = ''
          pull.x = pull.y = pull.tx = pull.ty = 0
        })
        pulls.clear()
        target = null
      } else {
        host.classList.remove(styles.link, styles.text)
        setKind('cross')
      }
    }

    // Label next to the pointer, flipped at the right and bottom edge so it stays on screen.
    const tagAt = (wrapper: HTMLElement, px: number, py: number, width: number) => {
      const flip = px + 16 + width > window.innerWidth

      place(wrapper, flip ? px - 16 : px + 16, py + 20 > window.innerHeight - 30 ? py - 34 : py + 18)
      wrapper.dataset.flip = flip ? 'true' : ''
    }

    const render = () => {
      const k = reduce.matches ? 1 : 0.4

      if (readingMode) {
        place(nodes.dot, x, y)
        place(nodes.ring, x, y)

        return
      }

      place(nodes.dot, x, y)

      if (kind === 'cross') {
        place(nodes.cross, x, y)
        write(nodes.tagText, `x ${Math.round(x - ruler)}  y ${Math.round(y - top + window.scrollY)}`)
        nodes.tag.dataset.tone = 'coords'
        tagAt(nodes.tag, x, y, 118)
      } else if (kind === 'text') {
        place(nodes.caret, x, y)
        write(nodes.tagText, `Ln ${getLineNumber(window.scrollY)}`)
        nodes.tag.dataset.tone = 'ln'
        tagAt(nodes.tag, x + 4, y, 52)
      } else if (kind === 'block') {
        place(nodes.block, x, y)
      } else if (kind === 'paw') {
        place(nodes.paw, x, y)
      } else if (kind === 'frame' && target) {
        const rect = rectOf(target)
        const pull = pulls.get(target)

        if (pull) {
          // A pull of at most PULL_MAX px toward the pointer, eased; the element moves with the individual translate.
          pull.tx = clamp(((x - (rect.x + rect.w / 2)) / (rect.w / 2)) * PULL_MAX, PULL_MAX)
          pull.ty = clamp(((y - (rect.y + rect.h / 2)) / (rect.h / 2)) * PULL_MAX, PULL_MAX)
        }

        const goal = {
          x: rect.x + (pull?.x ?? 0) - OUTSET,
          y: rect.y + (pull?.y ?? 0) - OUTSET,
          w: rect.w + OUTSET * 2,
          h: rect.h + OUTSET * 2
        }

        if (!shape.shown) {
          // The frame grows out of the pointer, or snaps at once with reduced motion.
          Object.assign(shape, reduce.matches ? goal : { x, y, w: 0, h: 0 }, { shown: true })
        }

        shape.x += (goal.x - shape.x) * k
        shape.y += (goal.y - shape.y) * k
        shape.w += (goal.w - shape.w) * k
        shape.h += (goal.h - shape.h) * k

        const [tl, tr, bl, br] = nodes.corners

        place(tl, shape.x, shape.y)
        place(tr, shape.x + shape.w - CORNER, shape.y)
        place(bl, shape.x, shape.y + shape.h - CORNER)
        place(br, shape.x + shape.w - CORNER, shape.y + shape.h - CORNER)

        // The real size of the element, not of the frame.
        write(nodes.sizeText, `${Math.round(rect.w)} × ${Math.round(rect.h)}`)

        const below = shape.y + shape.h + 30 < window.innerHeight

        place(nodes.sizeTag, shape.x, below ? shape.y + shape.h + 6 : shape.y - 28)
      }

      if (kind !== 'frame') shape.shown = false

      if (measuring && down) {
        const dx = x - down.x
        const dy = y - down.y
        const length = Math.hypot(dx, dy)

        place(nodes.line, down.x, down.y, ` rotate(${Math.atan2(dy, dx)}rad) scaleX(${(length / 100).toFixed(3)})`)
        place(nodes.origin, down.x, down.y)
        write(nodes.distText, `${Math.round(length)} px`)
        tagAt(nodes.distTag, (x + down.x) / 2 - 20, (y + down.y) / 2 - 10, 60)
      }

      // The pulled elements ease toward their goal and back; one that has settled at rest is released.
      pulls.forEach((pull, element) => {
        pull.x += (pull.tx - pull.x) * (reduce.matches ? 1 : 0.25)
        pull.y += (pull.ty - pull.y) * (reduce.matches ? 1 : 0.25)

        if (element !== target && Math.abs(pull.x) < 0.05 && Math.abs(pull.y) < 0.05) {
          element.style.translate = ''
          pulls.delete(element)
        } else {
          element.style.translate = `${pull.x.toFixed(2)}px ${pull.y.toFixed(2)}px`
        }
      })
    }

    const tick = (now: number) => {
      frame = 0

      if (!visible) return

      if (now - lastMove > IDLE_MS && !idle && !measuring) {
        idle = true
        host.classList.add(styles.idle)
      }

      if (idle) return

      if (reading.current !== readingMode) setMode(reading.current)

      if (retargetNext) {
        retargetNext = false
        retarget(document.elementFromPoint(x, y))
      }

      render()
      frame = window.requestAnimationFrame(tick)
    }

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(tick)
    }

    const wake = () => {
      lastMove = performance.now()

      if (idle) {
        idle = false
        host.classList.remove(styles.idle)
      }
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return

      x = event.clientX
      y = event.clientY
      wake()

      if (!visible) {
        visible = true
        host.classList.remove(styles.hidden)
      }

      if (reading.current !== readingMode) setMode(reading.current)

      retarget(event.target instanceof Element ? event.target : null)

      if (down?.empty && event.buttons === 1 && !measuring && Math.hypot(x - down.x, y - down.y) > DRAG_MIN) {
        measuring = true
        host.dataset.measuring = 'true'
      }

      schedule()
    }

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return

      down = { x: event.clientX, y: event.clientY, empty: !readingMode && kind === 'cross' }
    }

    const dropPin = (px: number, py: number) => {
      const mark = nodes.pins[pinIndex++ % nodes.pins.length]

      place(mark, px, py)
      mark.getAnimations().forEach(animation => animation.cancel())

      if (reduce.matches) {
        // Static: the mark appears and goes, it does not fade.
        mark.style.opacity = '1'
        window.setTimeout(() => (mark.style.opacity = ''), 600)

        return
      }

      mark.animate([{ opacity: 1 }, { opacity: 1, offset: 0.35 }, { opacity: 0 }], {
        duration: 900,
        easing: 'ease-out'
      })
    }

    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return

      if (measuring) {
        measuring = false
        delete host.dataset.measuring
      } else if (down?.empty && kind === 'cross') {
        dropPin(event.clientX, event.clientY)
      }

      down = null
    }

    const onCancel = () => {
      measuring = false
      down = null
      delete host.dataset.measuring
    }

    // A scroll or a resize moves everything: measure again, and look under the pointer again.
    const onLayout = () => {
      epoch += 1
      retargetNext = true
      ruler = readPx('--ruler')
      top = readPx('--top') + ruler
      schedule()
    }

    const onLeave = () => {
      visible = false
      onCancel()
      host.classList.add(styles.hidden)
    }

    // The top layer sits above every z-index, so a Term popover would cover the cursor. The cursor is a manual popover
    // too and is shown again whenever another one opens, which puts it last in the top layer.
    const raise = () => {
      if (typeof host.showPopover !== 'function') return

      if (host.matches(':popover-open')) host.hidePopover()

      host.showPopover()
    }

    const onToggle = (event: Event) => {
      if (event.target !== host && (event as ToggleEvent).newState === 'open') raise()
    }

    html.classList.add('has-cur')
    ruler = readPx('--ruler')
    top = readPx('--top') + ruler
    setMode(reading.current)
    raise()

    document.addEventListener('toggle', onToggle, true)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    window.addEventListener('blur', onCancel)
    window.addEventListener('scroll', onLayout, { passive: true, capture: true })
    window.addEventListener('resize', onLayout)
    html.addEventListener('mouseleave', onLeave)

    return () => {
      document.removeEventListener('toggle', onToggle, true)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      window.removeEventListener('blur', onCancel)
      window.removeEventListener('scroll', onLayout, true)
      window.removeEventListener('resize', onLayout)
      html.removeEventListener('mouseleave', onLeave)
      window.cancelAnimationFrame(frame)
      pulls.forEach((_, element) => (element.style.translate = ''))

      if (host.matches(':popover-open')) host.hidePopover()

      html.classList.remove('has-cur')
    }
  }, [reading])

  return (
    <div ref={root} popover='manual' aria-hidden='true' className={`${styles.cur} ${styles.hidden}`} data-kind='cross'>
      <span ref={cross} className={styles.cross} />
      <span ref={tag} className={styles.tag}>
        <span ref={tagText} />
      </span>
      <span ref={caret} className={styles.caret} />
      <span ref={block} className={styles.block} />
      <span ref={paw} className={styles.paw}>
        <svg viewBox='0 0 24 24' width='22' height='22'>
          <path d='M12 13c-2.6 0-5.2 2.4-5.2 4.6 0 1.7 1.4 2.4 2.8 2.4 1 0 1.6-.4 2.4-.4s1.4.4 2.4.4c1.4 0 2.8-.7 2.8-2.4C17.2 15.4 14.6 13 12 13Z' />
          <ellipse cx='5.4' cy='11' rx='1.9' ry='2.5' />
          <ellipse cx='9.4' cy='6.6' rx='1.9' ry='2.6' />
          <ellipse cx='14.6' cy='6.6' rx='1.9' ry='2.6' />
          <ellipse cx='18.6' cy='11' rx='1.9' ry='2.5' />
        </svg>
      </span>
      {[0, 1, 2, 3].map(index => (
        <span
          key={index}
          ref={element => {
            corners.current[index] = element
          }}
          className={styles.corner}
          data-corner={index}
        />
      ))}
      <span ref={sizeTag} className={styles.sizeTag}>
        <span ref={sizeText} />
      </span>
      <span ref={line} className={styles.line} />
      <span ref={origin} className={styles.origin} />
      <span ref={distTag} className={styles.distTag}>
        <span ref={distText} />
      </span>
      {[0, 1, 2].map(index => (
        <span
          key={index}
          ref={element => {
            pins.current[index] = element
          }}
          className={styles.pin}
        />
      ))}
      <span ref={ring} className={styles.ring} />
      <span ref={dot} className={styles.dot} />
    </div>
  )
}

export default Cursor
