'use client'

import { useEffect, useSyncExternalStore } from 'react'

import { usePathname } from '@/i18n/navigation'
import { SECTIONS, type SectionId } from '@/lib/sections'
import { getActiveIndex, getLineNumber, getProgress } from '@/lib/scroll-spy'

type ScrollState = Readonly<{
  activeId: SectionId | null
  progress: number
  line: number
}>

// Matches the server HTML: the hero tab starts active, like in the prototype.
const INITIAL_STATE: ScrollState = { activeId: 'index', progress: 0, line: 1 }

// One shared store, so the top bar and the status bar use a single scroll listener.
let state = INITIAL_STATE
let frame = 0
const listeners = new Set<() => void>()

const measure = () => {
  frame = 0

  const present = SECTIONS.map(section => document.getElementById(section.id)).filter(
    (element): element is HTMLElement => element !== null
  )

  const tops = present.map(element => element.getBoundingClientRect().top)
  const scrollable = document.documentElement.scrollHeight - window.innerHeight

  const next: ScrollState = {
    activeId: present.length > 0 ? (present[getActiveIndex(tops, window.innerHeight)].id as SectionId) : null,
    progress: getProgress(window.scrollY, scrollable),
    line: getLineNumber(window.scrollY)
  }

  if (next.activeId === state.activeId && next.progress === state.progress && next.line === state.line) return

  state = next
  listeners.forEach(listener => listener())
}

const schedule = () => {
  if (frame === 0) frame = window.requestAnimationFrame(measure)
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  if (listeners.size === 1) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  }

  schedule()

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0) {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.cancelAnimationFrame(frame)
      frame = 0
    }
  }
}

export const useScrollSpy = () => {
  const pathname = usePathname()

  useEffect(() => {
    schedule()
  }, [pathname])

  return useSyncExternalStore(
    subscribe,
    () => state,
    () => INITIAL_STATE
  )
}
