import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

// Locale-aware versions of Next's Link and router: `/de` is added when needed.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
