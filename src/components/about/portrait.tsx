'use client'

import { type PointerEvent, useEffect, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

import styles from './about.module.css'

// Character cell and tone ramp from the prototype.
const CELL_W = 5.4
const CELL_H = 8.6
const RAMP = " .'`:-~=+*cxoO0#@"

const clamp = (value: number) => Math.min(1, Math.max(0, value))

const luminance = (data: Uint8ClampedArray, index: number) =>
  (data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114) / 255

// Renders the photo as ASCII on the canvas (prototype app.js drawAscii). Returns false if pixels are unreadable.
const drawAscii = (photo: HTMLImageElement, canvas: HTMLCanvasElement) => {
  const box = canvas.parentElement!.getBoundingClientRect()
  const ratio = window.devicePixelRatio || 1

  canvas.width = box.width * ratio
  canvas.height = box.height * ratio

  const context = canvas.getContext('2d')

  if (!context) return false

  context.scale(ratio, ratio)

  const cols = Math.floor(box.width / CELL_W)
  const rows = Math.floor(box.height / CELL_H)
  const sample = document.createElement('canvas')

  sample.width = cols
  sample.height = rows

  const sampleContext = sample.getContext('2d')!

  // Cover-fit the photo into the character grid.
  const imageRatio = photo.naturalWidth / photo.naturalHeight
  const gridRatio = (cols * CELL_W) / (rows * CELL_H)
  let sw = photo.naturalWidth
  let sh = photo.naturalHeight
  let sx = 0
  let sy = 0

  if (imageRatio > gridRatio) {
    sw = sh * gridRatio
    sx = (photo.naturalWidth - sw) / 2
  } else {
    sh = sw / gridRatio
    sy = (photo.naturalHeight - sh) / 2
  }

  sampleContext.drawImage(photo, sx, sy, sw, sh, 0, 0, cols, rows)

  let data: Uint8ClampedArray

  try {
    data = sampleContext.getImageData(0, 0, cols, rows).data
  } catch {
    return false
  }

  // Stretch the tones first, the grey studio backdrop would otherwise fill the frame with noise.
  const lum: number[] = []

  for (let index = 0; index < data.length; index += 4) lum.push(luminance(data, index))

  const sorted = [...lum].sort((a, b) => a - b)
  const low = sorted[Math.floor(sorted.length * 0.04)]
  const high = sorted[Math.floor(sorted.length * 0.985)]

  // A blurred copy gives local contrast, which keeps eyes and beard readable.
  const tiny = document.createElement('canvas')

  tiny.width = Math.max(4, cols >> 3)
  tiny.height = Math.max(4, rows >> 3)
  tiny.getContext('2d')!.drawImage(sample, 0, 0, tiny.width, tiny.height)

  const blurred = document.createElement('canvas')

  blurred.width = cols
  blurred.height = rows

  const blurredContext = blurred.getContext('2d')!

  blurredContext.imageSmoothingQuality = 'high'
  blurredContext.drawImage(tiny, 0, 0, cols, rows)

  const blurData = blurredContext.getImageData(0, 0, cols, rows).data
  const font = getComputedStyle(document.documentElement).getPropertyValue('--font-geist-mono').trim() || 'monospace'

  context.fillStyle = '#0A0E1A'
  context.fillRect(0, 0, box.width, box.height)
  context.font = `500 8.4px ${font}`
  context.textBaseline = 'top'

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = y * cols + x
      const blur = luminance(blurData, cell * 4)
      const normal = clamp((lum[cell] - low) / (high - low))
      const local = clamp((lum[cell] - blur) * 3 + 0.5)
      const value = Math.pow(clamp(normal * 0.6 + (local - 0.5) * 0.9), 1.4)
      const char = RAMP[Math.min(RAMP.length - 1, Math.floor(value * RAMP.length))]

      if (char === ' ') continue

      context.fillStyle = `rgba(230,232,238,${(0.3 + value * 0.7).toFixed(2)})`
      context.fillText(char, x * CELL_W, y * CELL_H)
    }
  }

  return true
}

// ASCII portrait; a round lens shows the photo under the pointer, the button renders the full image.
const Portrait = () => {
  const t = useTranslations('about.portrait')
  const [revealed, setRevealed] = useState(false)
  const photoRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const photo = photoRef.current
    const canvas = canvasRef.current

    if (!photo || !canvas) return

    const draw = () => {
      if (!photo.complete || !photo.naturalWidth) return

      // Without readable pixels there is no ASCII version, so the photo is shown instead.
      if (!drawAscii(photo, canvas)) setRevealed(true)
    }

    draw()
    photo.addEventListener('load', draw)
    window.addEventListener('resize', draw)

    return () => {
      photo.removeEventListener('load', draw)
      window.removeEventListener('resize', draw)
    }
  }, [])

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const photo = photoRef.current

    if (revealed || !photo) return

    const box = event.currentTarget.getBoundingClientRect()
    const mask = `radial-gradient(circle 74px at ${event.clientX - box.left}px ${event.clientY - box.top}px, #000 96%, transparent 100%)`

    photo.style.maskImage = mask
    photo.style.opacity = '1'
  }

  const onPointerLeave = () => {
    if (!revealed && photoRef.current) photoRef.current.style.opacity = '0'
  }

  const toggle = () => {
    const photo = photoRef.current
    const next = !revealed

    setRevealed(next)

    if (photo) {
      photo.style.maskImage = next ? 'none' : ''
      photo.style.opacity = next ? '1' : '0'
    }
  }

  return (
    <figure className={styles.portrait}>
      <div
        className={cn(styles.frame, revealed && styles.reveal)}
        data-shell-ui=''
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <canvas ref={canvasRef} aria-hidden='true' />
        <img ref={photoRef} src='/portrait.webp' alt={t('alt')} width={639} height={960} loading='lazy' />
      </div>
      <figcaption className={styles.cap}>
        <span>portrait.webp 639×960</span>
        <button type='button' onClick={toggle}>
          {revealed ? t('hide') : t('reveal')}
        </button>
      </figcaption>
    </figure>
  )
}

export default Portrait
