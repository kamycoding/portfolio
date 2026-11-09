'use client'

import { useSyncExternalStore } from 'react'

// "Ready" releases the first-paint choreography (fade-ins, typed headline), like body.ready in the
// prototype. Phase 9 sets it after the intro; until then it is set right after hydration.
let ready = false
const listeners = new Set<() => void>()

export const setReady = () => {
  if (ready) return

  ready = true
  document.documentElement.classList.add('ready')
  listeners.forEach(listener => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => listeners.delete(listener)
}

export const useReady = () =>
  useSyncExternalStore(
    subscribe,
    () => ready,
    () => false
  )
