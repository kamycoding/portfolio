'use client'

import { useSyncExternalStore } from 'react'

const cologneTime = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin'
})

// The prototype shows the zone as the English short name, which browsers give as GMT+1 or GMT+2.
const cologneZone = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Berlin', timeZoneName: 'short' })

const zoneName = () => cologneZone.formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value ?? ''

const subscribe = (onChange: () => void) => {
  const timer = window.setInterval(onChange, 15_000)

  return () => window.clearInterval(timer)
}

// The server cannot know the visitor's time, so it renders a placeholder and the browser fills it in.
export const useCologneTime = (withZone = false) =>
  useSyncExternalStore(
    subscribe,
    () => (withZone ? `${cologneTime.format(new Date())} ${zoneName()}` : cologneTime.format(new Date())),
    () => (withZone ? '--:-- CET' : '--:--')
  )
