'use client'

// Lets the terminal open a project's README drawer, which the work list owns. Focus returns to the opener on close.
type Request = (index: number, opener: HTMLElement) => void

const listeners = new Set<Request>()

export const openProject = (index: number, opener: HTMLElement) =>
  listeners.forEach(listener => listener(index, opener))

export const onOpenProject = (listener: Request) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}
