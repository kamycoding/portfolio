'use client'

import { useSyncExternalStore } from 'react'

const cologneTime = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin'
})

const subscribe = (onChange: () => void) => {
  const timer = window.setInterval(onChange, 15_000)

  return () => window.clearInterval(timer)
}

// The server cannot know the visitor's time, so it renders a placeholder and the browser fills it in.
export const useCologneTime = () =>
  useSyncExternalStore(
    subscribe,
    () => cologneTime.format(new Date()),
    () => '--:--'
  )
