// Small browser actions shared by the hero, the terminal and (Phase 9) the command palette and shortcuts.
import { showToast } from '@/hooks/use-toast'

import { EMAIL } from './site'

// The address lives in site.ts, so server code can use it without loading these browser actions.
export { EMAIL }

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const goToSection = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })

// Falls back to showing the address when the clipboard is not available (http, old browsers).
export const copyEmail = async (copiedMessage: string) => {
  try {
    await navigator.clipboard.writeText(EMAIL)
    showToast(copiedMessage)

    return true
  } catch {
    showToast(EMAIL)

    return false
  }
}
