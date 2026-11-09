'use client'

import { useEffect } from 'react'

import { setReady } from '@/hooks/use-ready'

// Releases the first-paint choreography once the page is interactive. Phase 9 moves this behind the intro.
const ReadyGate = () => {
  useEffect(() => {
    setReady()
  }, [])

  return null
}

export default ReadyGate
