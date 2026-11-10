import { NextRequest } from 'next/server'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import proxy from './proxy'

const handlers = vi.hoisted(() => ({ normal: vi.fn(), journal: vi.fn(), configs: [] as Record<string, unknown>[] }))

// Verify handler selection here; production HTTP checks exercise next-intl's real headers.
vi.mock('next-intl/middleware', () => ({
  default: (options: Record<string, unknown>) => {
    handlers.configs.push(options)

    return options.alternateLinks === false ? handlers.journal : handlers.normal
  }
}))

beforeEach(() => {
  handlers.normal.mockClear()
  handlers.journal.mockClear()
})

describe('journal-only proxy handler', () => {
  it('disables alternates only on the second handler and preserves all other routing options', () => {
    const [normal, journal] = handlers.configs

    expect(normal.alternateLinks).toBeUndefined()
    expect(journal).toEqual({ ...normal, alternateLinks: false })
  })

  it.each(['/blog', '/de/blog', '/blog/fixture', '/de/blog/fixture', '/en/blog/fixture'])(
    'selects the journal handler for %s',
    path => {
      const request = new NextRequest(`https://kamycoding.com${path}`)

      proxy(request)
      expect(handlers.journal).toHaveBeenCalledWith(request)
      expect(handlers.normal).not.toHaveBeenCalled()
    }
  )

  it.each([
    '/',
    '/de',
    '/legal-notice',
    '/de/legal-notice',
    '/privacy-policy',
    '/de/privacy-policy',
    '/blogger',
    '/de/blogger'
  ])('keeps the normal handler for %s', path => {
    const request = new NextRequest(`https://kamycoding.com${path}`)

    proxy(request)
    expect(handlers.normal).toHaveBeenCalledWith(request)
    expect(handlers.journal).not.toHaveBeenCalled()
  })
})
