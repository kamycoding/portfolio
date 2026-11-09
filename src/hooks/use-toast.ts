'use client'

import { useSyncExternalStore } from 'react'

type ToastState = Readonly<{ message: string; id: number }>

const EMPTY: ToastState = { message: '', id: 0 }

let state = EMPTY
let timer = 0
const listeners = new Set<() => void>()

const emit = () => listeners.forEach(listener => listener())

// Shows a short message in the shared toast, like the prototype (1.7s).
export const showToast = (message: string) => {
  state = { message, id: state.id + 1 }
  emit()
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    state = { ...state, message: '' }
    emit()
  }, 1700)
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => listeners.delete(listener)
}

export const useToast = () =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY
  )
