import type { ContributionSnapshot } from '@/lib/contributions'

import snapshot from './contributions.json'

// GitHub contributions of kamycoding, refreshed before every build; the committed file is the fallback (ADR 0006).
export const CONTRIBUTIONS = snapshot as ContributionSnapshot

export const PROFILE_URL = 'https://github.com/kamycoding'
export const PROFILE_LABEL = 'github.com/kamycoding'
