'use client'

import { useSyncExternalStore } from 'react'

// Shared by every cat on the page and the status bar, so they wake and sleep together.
type CatState = Readonly<{
  awake: boolean

  // Increments on every wake-up so the stretch animation and the code line flash restart.
  wakes: number

  // The text stays after hiding so the bubble can fade out with its content.
  bubble: 'meow' | 'purr'
  bubbleVisible: boolean
}>

const INITIAL: CatState = { awake: false, wakes: 0, bubble: 'meow', bubbleVisible: false }

// Timings from the prototype: awake for 7s, speech bubble for 1.8s.
const AWAKE_MS = 7000
const BUBBLE_MS = 1800

let state = INITIAL
let sleepTimer = 0
let bubbleTimer = 0
const listeners = new Set<() => void>()

const set = (next: Partial<CatState>) => {
  state = { ...state, ...next }
  listeners.forEach(listener => listener())
}

const say = (bubble: 'meow' | 'purr') => {
  set({ bubble, bubbleVisible: true })
  window.clearTimeout(bubbleTimer)
  bubbleTimer = window.setTimeout(() => set({ bubbleVisible: false }), BUBBLE_MS)
}

export const wakeCat = () => {
  set({ awake: true, wakes: state.wakes + 1 })
  say('meow')
  window.clearTimeout(sleepTimer)
  sleepTimer = window.setTimeout(() => set({ awake: false }), AWAKE_MS)
}

// A slow hover on a sleeping cat gets a purr instead of a wake-up. Returns whether it purred.
export const purrCat = () => {
  if (state.awake) return false

  say('purr')

  return true
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => listeners.delete(listener)
}

export const useCat = () =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => INITIAL
  )
