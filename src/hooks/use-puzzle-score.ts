'use client'

import { useSyncExternalStore } from 'react'

// The running score across the puzzles of one article: how many were checked and how many were right.
export type PuzzleScore = Readonly<{ correct: number; attempted: number }>

const EMPTY: PuzzleScore = { correct: 0, attempted: 0 }

const results = new Map<string, boolean>()
let score = EMPTY
const listeners = new Set<() => void>()

const publish = () => {
  score = { correct: [...results.values()].filter(Boolean).length, attempted: results.size }
  listeners.forEach(listener => listener())
}

export const recordPuzzle = (id: string, correct: boolean) => {
  results.set(id, correct)
  publish()
}

// Try again, or the puzzle left the page.
export const clearPuzzle = (id: string) => {
  if (results.delete(id)) publish()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export const usePuzzleScore = () =>
  useSyncExternalStore(
    subscribe,
    () => score,
    () => EMPTY
  )
