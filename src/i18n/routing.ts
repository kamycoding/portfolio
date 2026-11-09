import { defineRouting } from 'next-intl/routing'

// English stays at `/`, German lives under `/de`. See docs/adr/0004-locale-routing.md
export const routing = defineRouting({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',

  // HTTPS only. Chrome and Firefox treat http://localhost as secure, so local dev keeps working.
  localeCookie: { secure: true }
})
