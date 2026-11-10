import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Resolves the @/ imports of components under test, as Next.js does.
  resolve: { tsconfigPaths: true },
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'netlify/tests/**/*.spec.ts']
  }
})
