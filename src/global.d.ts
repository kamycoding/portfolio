import type { routing } from '@/i18n/routing'
import type messages from '../messages/en.json'

// Type-checks locales and message keys: a missing or misspelled key fails the build.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
