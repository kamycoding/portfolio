'use client'

import { useSyncExternalStore } from 'react'

import { prefersReducedMotion } from '@/lib/actions'
import { BUILD_MAX, clampBuild, easeInOut } from '@/lib/blueprint'

// Plan/build slider state, shared by the slider, the editor layers, the tilt and (later) the terminal.
type BlueprintState = Readonly<{
  build: number
  dragging: boolean
}>

const INITIAL: BlueprintState = { build: BUILD_MAX, dragging: false }

let state = INITIAL
let frame = 0
const listeners = new Set<() => void>()

const set = (next: Partial<BlueprintState>) => {
  state = { ...state, ...next }
  listeners.forEach(listener => listener())
}

export const getBlueprint = () => state

export const subscribeBlueprint = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

const stopAnimation = () => {
  window.cancelAnimationFrame(frame)
  frame = 0
}

export const setBuild = (value: number) => {
  stopAnimation()
  set({ build: clampBuild(value) })
}

export const setDragging = (dragging: boolean) => {
  if (dragging) stopAnimation()

  set({ dragging })
}

// Eased sweep to a target; reduced motion jumps straight there.
export const animateBuild = (to: number, duration = 500, delay = 0) => {
  stopAnimation()

  const target = clampBuild(to)

  if (prefersReducedMotion() || duration <= 0) return set({ build: target })

  const from = state.build
  const start = performance.now() + delay

  const step = (now: number) => {
    const t = Math.min(1, Math.max(0, (now - start) / duration))

    set({ build: from + (target - from) * easeInOut(t) })
    frame = t < 1 ? window.requestAnimationFrame(step) : 0
  }

  frame = window.requestAnimationFrame(step)
}

export const useBlueprint = () =>
  useSyncExternalStore(
    subscribeBlueprint,
    () => state,
    () => INITIAL
  )
