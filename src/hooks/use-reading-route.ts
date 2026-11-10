'use client'

import { useEffect, useRef } from 'react'

import { usePathname } from '@/i18n/navigation'

// Journal pages mark their reader (components/blog/reader.tsx). CSS reads the marker through :has() from the first
// paint; the cursor and rulers read it once per route here, never per pointer move.
export const READING_MARKER = '[data-reading]'

export const useReadingRoute = () => {
  const pathname = usePathname()
  const reading = useRef(false)

  useEffect(() => {
    reading.current = document.querySelector(READING_MARKER) !== null
  }, [pathname])

  return { reading, pathname }
}
