'use client'

import { useSyncExternalStore } from 'react'

// Which article section the narration player is on, shared with the Outline so it can mark that section and so
// that choosing an entry while the narration plays can jump there.
type NarrationState = Readonly<{ current: string | null; playing: boolean }>

const IDLE: NarrationState = { current: null, playing: false }

let state = IDLE
let jump: ((id: string) => boolean) | null = null
const listeners = new Set<() => void>()

export const setNarration = (next: NarrationState) => {
  if (next.current === state.current && next.playing === state.playing) return

  state = next
  listeners.forEach(listener => listener())
}

// The player registers how to jump while it is mounted.
export const registerNarrationJump = (handler: ((id: string) => boolean) | null) => {
  jump = handler
}

// True when the narration took over and moved to that section.
export const jumpNarrationTo = (id: string) => jump?.(id) ?? false

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export const useNarration = () =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => IDLE
  )
