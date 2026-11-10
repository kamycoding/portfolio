'use client'

import { useSyncExternalStore } from 'react'

type Current = Readonly<{ id: string; stop: () => void }>

// One clip at a time across the page: starting another stops the current one first.
let current: Current | null = null
const listeners = new Set<() => void>()

const emit = () => listeners.forEach(listener => listener())

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export const startPlayback = (id: string, stop: () => void) => {
  const previous = current

  current = { id, stop }
  if (previous && previous.id !== id) previous.stop()
  emit()
}

export const endPlayback = (id: string) => {
  if (current?.id !== id) return

  current = null
  emit()
}

// Used on unmount, so leaving an article never leaves a clip playing.
export const stopPlayback = (id: string) => {
  if (current?.id === id) current.stop()
}

export const usePlayingId = () =>
  useSyncExternalStore(
    subscribe,
    () => current?.id ?? null,
    () => null
  )
