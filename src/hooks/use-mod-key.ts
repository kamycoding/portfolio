'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// Apple devices show ⌘, everything else Ctrl (prototype app.js isMac). The static HTML starts with ⌘, as in the prototype.
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

export const useModKey = () =>
  useSyncExternalStore(
    subscribe,
    () => (isApple() ? '⌘' : 'Ctrl'),
    () => '⌘'
  )
