'use client'

import { useSyncExternalStore } from 'react'

import { getActiveHeading, getReadingProgress, type Viewport } from '@/lib/blog/reading'

export type ArticleProgress = Readonly<{
  tracking: boolean
  activeId: string | null
  progress: number
}>

const IDLE: ArticleProgress = { tracking: false, activeId: null, progress: 0 }

// One shared store, so the Outline and the status bar read a single measurement per frame.
let state = IDLE
let frame = 0
let target: Readonly<{ body: HTMLElement; ids: readonly string[] }> | null = null
const listeners = new Set<() => void>()

const emit = (next: ArticleProgress) => {
  if (next.tracking === state.tracking && next.activeId === state.activeId && next.progress === state.progress) return

  state = next
  listeners.forEach(listener => listener())
}

// The fixed top bar and ruler sit inside scroll-padding-top, the status bar is --status high.
const measureViewport = (): Viewport => {
  const root = getComputedStyle(document.documentElement)

  return {
    height: window.innerHeight,
    top: parseFloat(root.scrollPaddingTop) || 0,
    bottom: parseFloat(root.getPropertyValue('--status')) || 0
  }
}

const measure = () => {
  frame = 0

  if (!target) return

  const viewport = measureViewport()
  const body = target.body.getBoundingClientRect()
  const tops = target.ids.map(id => document.getElementById(id)?.getBoundingClientRect().top ?? Infinity)

  // The end of the body, not of the document: the footer below never counts as reading. 1px absorbs subpixels.
  const atEnd = body.bottom <= viewport.height - viewport.bottom + 1

  // A heading reached through an Outline link stops exactly at scroll-padding-top; allow for rounding.
  const active = getActiveHeading(tops, viewport.top + 2, viewport, atEnd)

  emit({
    tracking: true,
    activeId: active >= 0 ? target.ids[active] : null,
    progress: getReadingProgress(body.top, body.height, viewport)
  })
}

const schedule = () => {
  if (frame === 0) frame = window.requestAnimationFrame(measure)
}

// Called by the article on mount; the cleanup resets the store, so navigation never shows stale progress.
export const trackArticle = (body: HTMLElement, ids: readonly string[]) => {
  target = { body, ids }

  // Fonts, images and opened details change the body height without a scroll or resize event.
  const observer = new ResizeObserver(schedule)

  observer.observe(body)
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  schedule()

  return () => {
    observer.disconnect()
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    window.cancelAnimationFrame(frame)
    frame = 0

    if (target?.body === body) {
      target = null
      emit(IDLE)
    }
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export const useArticleProgress = () =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => IDLE
  )
