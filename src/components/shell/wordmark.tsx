'use client'

import { type CSSProperties, useEffect, useRef, useState } from 'react'

import Cat from '@/components/cat/cat'
import { prefersReducedMotion } from '@/lib/actions'
import { cn } from '@/lib/utils'

import styles from './footer.module.css'

// Single-stroke geometric letters in the line style of the cat and the covers.
// Units: x-height from y 70 to the baseline at 170, ascenders to 20, descenders to about 220.
const ring = (cx: number, cy = 120, r = 50) =>
  `M${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}`

type Glyph = Readonly<{ width: number; strokes: (x: number) => string[] }>

const GLYPHS: Readonly<Record<string, Glyph>> = {
  k: { width: 72, strokes: x => [`M${x} 20V170`, `M${x + 68} 70L${x} 124`, `M${x + 24} 106L${x + 72} 170`] },
  a: { width: 100, strokes: x => [ring(x + 50), `M${x + 100} 70V170`] },
  m: {
    width: 140,
    strokes: x => [
      `M${x} 70V170`,
      `M${x} 105A35 35 0 0 1 ${x + 70} 105V170`,
      `M${x + 70} 105A35 35 0 0 1 ${x + 140} 105V170`
    ]
  },
  y: { width: 100, strokes: x => [`M${x} 70L${x + 50} 170`, `M${x + 100} 70L${x + 25} 220`] },
  c: { width: 86, strokes: x => [`M${x + 85.4} 84.6A50 50 0 1 0 ${x + 85.4} 155.4`] },
  o: { width: 100, strokes: x => [ring(x + 50)] },
  d: { width: 100, strokes: x => [ring(x + 50), `M${x + 100} 20V170`] },
  i: { width: 0, strokes: x => [`M${x} 70V170`, ring(x, 36, 6)] },
  n: { width: 80, strokes: x => [`M${x} 70V170`, `M${x} 110A40 40 0 0 1 ${x + 80} 110V170`] },
  g: { width: 100, strokes: x => [ring(x + 50), `M${x + 100} 70V185C${x + 100} 228 ${x + 20} 232 ${x + 4} 202`] }
}

const GAP = 30

// The thin "i" gets a little more air, so "din" does not read as three equal stems.
const EXTRA_AIR = new Set(['i'])

const PAD = 6

const layout = () => {
  let x = PAD
  const letters: { char: string; x: number; strokes: string[] }[] = []

  for (const char of 'kamycoding') {
    const glyph = GLYPHS[char]
    const air = EXTRA_AIR.has(char) ? 6 : 0

    x += air
    letters.push({ char, x, strokes: glyph.strokes(x) })
    x += glyph.width + GAP + air
  }

  return { letters, width: x - GAP + PAD }
}

const { letters: LETTERS, width: WIDTH } = layout()

const TOP = 12
const HEIGHT = 226

// The cat lies on the humps of the "m": its body's flat bottom (y 70 of its 140 x 110 drawing) meets the x-height.
const CAT_WIDTH = 128
const CAT_SCALE = CAT_WIDTH / 140
const M_LEFT = LETTERS.find(letter => letter.char === 'm')!.x
const CAT_LEFT = M_LEFT + 70 - 75 * CAT_SCALE
const CAT_TOP = 70 - 70 * CAT_SCALE

const percent = (value: number, of: number) => `${((value / of) * 100).toFixed(3)}%`

const CAT_POSITION = {
  '--cat-left': percent(CAT_LEFT, WIDTH),
  '--cat-top': percent(CAT_TOP - TOP, HEIGHT),
  '--cat-width': percent(CAT_WIDTH, WIDTH)
} as CSSProperties

// "kamycoding" as a line drawing that draws itself once. Decorative: the brand link in the top bar carries the name.
const Wordmark = () => {
  const ref = useRef<HTMLDivElement>(null)

  // Server HTML shows it drawn; JS hides it only while it is still off screen, so no-JS and reduced motion just see it.
  const [reveal, setReveal] = useState<'idle' | 'pending' | 'play'>('idle')

  useEffect(() => {
    const element = ref.current

    if (!element || prefersReducedMotion()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setReveal('pending')

          return
        }

        setReveal('play')
        observer.disconnect()
      },
      { threshold: 0.4 }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(styles.wordmark, reveal === 'pending' && styles.pending, reveal === 'play' && styles.play)}
      style={CAT_POSITION}
    >
      <svg
        viewBox={`0 ${TOP} ${WIDTH} ${HEIGHT}`}
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
        className={styles.letters}
      >
        {LETTERS.map((letter, index) => (
          <g key={index} style={{ '--i': index } as CSSProperties}>
            {letter.strokes.map((d, stroke) => (
              <path
                key={stroke}
                d={d}
                pathLength={1}
                className={cn(letter.char === 'i' && stroke === 1 && styles.dot)}
              />
            ))}
          </g>
        ))}
      </svg>
      <Cat className={styles.cat} announce={false} />
    </div>
  )
}

export default Wordmark
