'use client'

import { useSyncExternalStore } from 'react'

// "Ready" releases the first-paint choreography (fade-ins, typed headline, code lines), like body.ready in the
// prototype. The intro sets it when it ends; replaying the intro unsets it and counts a new run.
let ready = false
let run = 0
const listeners = new Set<() => void>()

const notify = () => listeners.forEach(listener => listener())

export const setReady = () => {
  // Set every time: a language switch re-renders <html>, which drops both classes while the store is still ready.
  document.documentElement.classList.add('js', 'ready')

  if (ready) return

  ready = true
  run++
  notify()
}

export const unsetReady = () => {
  if (!ready) return

  ready = false
  document.documentElement.classList.remove('ready')
  notify()
}

export const isReady = () => ready

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

// Counts finished intros, so the hero can play its animations again after a replay.
export const useIntroRun = () =>
  useSyncExternalStore(
    subscribe,
    () => run,
    () => 0
  )
