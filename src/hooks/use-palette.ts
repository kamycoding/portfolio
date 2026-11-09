'use client'

import { useSyncExternalStore } from 'react'

// Open state of the command palette, shared by the top bar button, the shortcuts and the palette itself.
// "themes" opens it as the Color Theme picker, like VS Code's quick pick.
export type PaletteMode = 'commands' | 'themes'

type PaletteState = Readonly<{
  open: boolean
  mode: PaletteMode

  // Counts openings, so the palette can reset its query and selection for every new session.
  session: number
}>

let state: PaletteState = { open: false, mode: 'commands', session: 0 }
const listeners = new Set<() => void>()

const set = (next: PaletteState) => {
  state = next
  listeners.forEach(listener => listener())
}

export const openPalette = (mode: PaletteMode = 'commands') => {
  if (state.open && state.mode === mode) return

  set({ open: true, mode, session: state.session + 1 })
}

export const openThemePicker = () => openPalette('themes')

export const closePalette = () => {
  if (state.open) set({ ...state, open: false })
}

export const togglePalette = () => (state.open ? closePalette() : openPalette())

export const isPaletteOpen = () => state.open

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

const SERVER: PaletteState = { open: false, mode: 'commands', session: 0 }

export const usePalette = () =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER
  )

export const usePaletteOpen = () => usePalette().open
