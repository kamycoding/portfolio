import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // App tests only for now: the Netlify contact tests come back in Phase 8 (docs/ROADMAP.md).
    include: ['src/**/*.{test,spec}.{ts,tsx}']
  }
})
