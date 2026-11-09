'use client'

import { useSyncExternalStore } from 'react'

// Open state of the command palette, shared by the top bar button, the shortcuts and the palette itself.
let open = false
const listeners = new Set<() => void>()

const setOpen = (next: boolean) => {
  if (open === next) return

  open = next
  listeners.forEach(listener => listener())
}

export const openPalette = () => setOpen(true)

export const closePalette = () => setOpen(false)

export const togglePalette = () => setOpen(!open)

export const isPaletteOpen = () => open

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => listeners.delete(listener)
}

export const usePaletteOpen = () =>
  useSyncExternalStore(
    subscribe,
    () => open,
    () => false
  )
