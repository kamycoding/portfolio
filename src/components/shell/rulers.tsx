'use client'

import { useEffect, useRef } from 'react'

import { useTheme } from 'next-themes'

// Same breakpoint as the `lg` screen in globals.css: rulers are desktop only.
const DESKTOP_QUERY = '(min-width: 981px)'

// Crosshair and readout step aside over anything interactive.
const INTERACTIVE = 'a, button, input, textarea, select, label, [data-shell-ui]'

const readPx = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0

const Rulers = () => {
  const { resolvedTheme } = useTheme()
  const horizontalRef = useRef<HTMLCanvasElement>(null)
  const verticalRef = useRef<HTMLCanvasElement>(null)
  const crossXRef = useRef<HTMLDivElement>(null)
  const crossYRef = useRef<HTMLDivElement>(null)
  const markXRef = useRef<HTMLDivElement>(null)
  const markYRef = useRef<HTMLDivElement>(null)
  const coordRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY)
    let frame = 0

    const draw = () => {
      frame = 0

      if (!desktop.matches) return

      const styles = getComputedStyle(document.documentElement)
      const tickColor = styles.getPropertyValue('--hair-3').trim()
      const textColor = styles.getPropertyValue('--faint').trim()
      const font = `9px ${styles.getPropertyValue('--font-geist-mono').trim() || 'monospace'}`
      const size = readPx('--ruler')
      const ratio = window.devicePixelRatio || 1
      const offset = Math.round(window.scrollY)

      const rulers: Array<[HTMLCanvasElement | null, number, number, boolean]> = [
        [horizontalRef.current, window.innerWidth - size, size, true],
        [verticalRef.current, size, window.innerHeight, false]
      ]

      for (const [canvas, width, height, horizontal] of rulers) {
        const context = canvas?.getContext('2d')

        if (!canvas || !context) continue

        canvas.width = width * ratio
        canvas.height = height * ratio
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        context.scale(ratio, ratio)
        context.strokeStyle = tickColor
        context.fillStyle = textColor
        context.font = font
        context.lineWidth = 1

        // Ticks every 8px, taller every 40px, labelled every 80px. The vertical ruler follows the scroll position.
        const length = horizontal ? width : height
        const shift = horizontal ? 0 : offset % 8
        const base = horizontal ? 0 : offset - shift

        for (let position = -shift; position < length; position += 8) {
          const value = base + position + shift
          const tick = value % 80 === 0 ? 10 : value % 40 === 0 ? 6 : 3

          context.beginPath()

          if (horizontal) {
            context.moveTo(position + 0.5, size)
            context.lineTo(position + 0.5, size - tick)
          } else {
            context.moveTo(size, position + 0.5)
            context.lineTo(size - tick, position + 0.5)
          }

          context.stroke()

          if (value % 80 !== 0 || value <= 0) continue

          if (horizontal) {
            context.fillText(String(value), position + 3, 9)
          } else {
            context.save()
            context.translate(9, position + 3)
            context.rotate(-Math.PI / 2)
            context.fillText(String(value), 0, 0)
            context.restore()
          }
        }
      }
    }

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(draw)
    }

    const setVisible = (pointing: boolean, overUi: boolean) => {
      const lines = pointing && !overUi ? '1' : '0'

      if (crossXRef.current) crossXRef.current.style.opacity = lines
      if (crossYRef.current) crossYRef.current.style.opacity = lines
      if (coordRef.current) coordRef.current.style.opacity = lines
      if (markXRef.current) markXRef.current.style.opacity = pointing ? '1' : '0'
      if (markYRef.current) markYRef.current.style.opacity = pointing ? '1' : '0'
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !desktop.matches) return

      const ruler = readPx('--ruler')
      const top = readPx('--top') + ruler
      const bottom = window.innerHeight - readPx('--status')
      const { clientX: x, clientY: y } = event

      if (y < top || x < ruler || y > bottom) return setVisible(false, false)

      const overUi = event.target instanceof Element && event.target.closest(INTERACTIVE) !== null

      setVisible(true, overUi)

      if (crossXRef.current) crossXRef.current.style.transform = `translateX(${x}px)`
      if (crossYRef.current) crossYRef.current.style.transform = `translateY(${y}px)`
      if (markXRef.current) markXRef.current.style.transform = `translateX(${x}px)`
      if (markYRef.current) markYRef.current.style.transform = `translateY(${y}px)`

      if (coordRef.current) {
        coordRef.current.textContent = `x ${Math.round(x - ruler)}  y ${Math.round(y - top + window.scrollY)}`
        coordRef.current.style.transform = `translate(${x + 12}px, ${y + 12}px)`
      }
    }

    const onPointerLeave = () => setVisible(false, false)

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    desktop.addEventListener('change', schedule)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      desktop.removeEventListener('change', schedule)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
    }

    // Redraw with the new token colors when the theme changes.
  }, [resolvedTheme])

  return (
    <div aria-hidden='true' className='hidden lg:block'>
      <div className='border-hair bg-bg fixed top-(--top) left-0 z-36 grid size-(--ruler) place-items-center border-r border-b'>
        <span className='border-faint size-1.25 rounded-[1px] border' />
      </div>
      <div className='border-hair bg-bg fixed top-(--top) right-0 left-(--ruler) z-35 h-(--ruler) overflow-hidden border-b'>
        <canvas ref={horizontalRef} className='block' />
      </div>
      <div className='border-hair bg-bg fixed top-[calc(var(--top)+var(--ruler))] bottom-(--status) left-0 z-35 w-(--ruler) overflow-hidden border-r'>
        <canvas ref={verticalRef} className='block' />
      </div>

      <div
        ref={markXRef}
        className='bg-kw pointer-events-none fixed top-(--top) left-0 z-37 h-(--ruler) w-px opacity-0 transition-opacity'
      />
      <div
        ref={markYRef}
        className='bg-kw pointer-events-none fixed top-0 left-0 z-37 h-px w-(--ruler) opacity-0 transition-opacity'
      />
      <div
        ref={crossXRef}
        className='bg-kw/22 pointer-events-none fixed top-[calc(var(--top)+var(--ruler))] bottom-(--status) left-0 z-14 w-px opacity-0 transition-opacity'
      />
      <div
        ref={crossYRef}
        className='bg-kw/22 pointer-events-none fixed top-0 right-0 left-(--ruler) z-14 h-px opacity-0 transition-opacity'
      />
      <div
        ref={coordRef}
        className='bg-bg/92 border-kw/30 text-kw pointer-events-none fixed top-0 left-0 z-16 rounded border px-1.5 py-0.5 font-mono text-[10.5px] whitespace-nowrap opacity-0 transition-opacity'
      />
    </div>
  )
}

export default Rulers
