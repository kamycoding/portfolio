import { localePath } from './site'

// Helpers for the 404 page. Everything taken from the URL is only ever shown as text; links come from RouteCandidate.

export type RouteCandidate = Readonly<{ keys: readonly string[]; href: string }>

const MAX_PATH = 120
const LOCALE_PREFIX = /^\/(?:en|de)(?=\/|$)/

// Decoding can throw on malformed input; the raw path is still safe text. Control characters are dropped.
export const displayPath = (pathname: string) => {
  let decoded = pathname

  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    // Keep the encoded form.
  }

  const clean = decoded.replace(/[\u0000-\u001f\u007f]/g, '')

  return clean.length > MAX_PATH ? `${clean.slice(0, MAX_PATH - 1)}…` : clean
}

const segments = (pathname: string) => displayPath(pathname).replace(LOCALE_PREFIX, '').split('/').filter(Boolean)

// The editor tab for the missing file: journal paths open as MDX, other pages as TSX, real extensions stay.
export const tabName = (pathname: string) => {
  const parts = segments(pathname)
  const last = parts.at(-1) ?? 'index'

  if (/\.[a-z0-9]{1,8}$/i.test(last)) return last

  return `${last}.${parts[0] === 'blog' && parts.length > 1 ? 'mdx' : 'tsx'}`
}

// Edit distance where swapping two neighbouring letters counts as one typo (optimal string alignment).
const distance = (a: string, b: string) => {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => i || j))

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1

      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost)

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1)
      }
    }
  }

  return rows[a.length][b.length]
}

/*
 * The closest real route, like a CLI "did you mean": a small edit distance (a third of the route's length, at least
 * one) wins; a prefix of at least three characters is the fallback. Null when nothing is close.
 */
export const suggestRoute = (pathname: string, candidates: readonly RouteCandidate[]) => {
  const input = segments(pathname)
    .join('/')
    .toLowerCase()
    .replace(/\.(?:html?|php|aspx?)$/, '')

  if (!input) return null

  let best: Readonly<{ href: string; score: number }> | null = null

  for (const candidate of candidates) {
    for (const key of candidate.keys) {
      const prefix = input.length >= 3 && (key.startsWith(input) || input.startsWith(`${key}/`))
      const typos = distance(input, key)
      const close = typos <= Math.max(1, Math.floor(key.length / 3))
      const score = close ? typos : 100 + Math.abs(key.length - input.length)

      if (!close && !prefix) continue
      if (!best || score < best.score) best = { href: candidate.href, score }
    }
  }

  return best?.href ?? null
}

// The routes a 404 may suggest: homepage sections, the journal, its published posts and the legal pages.
export const notFoundRoutes = (locale: 'en' | 'de', slugs: readonly string[]): RouteCandidate[] => {
  const home = localePath(locale)

  return [
    { keys: ['index', 'home'], href: home },
    { keys: ['work', 'projects', 'projekte'], href: `${home}#work` },
    { keys: ['about', 'ueber-mich'], href: `${home}#about` },
    { keys: ['stack'], href: `${home}#stack` },
    { keys: ['contact', 'kontakt'], href: `${home}#contact` },
    { keys: ['blog', 'journal'], href: localePath(locale, '/blog') },
    ...[...new Set(slugs)].map(slug => ({ keys: [`blog/${slug}`], href: localePath(locale, `/blog/${slug}`) })),
    { keys: ['legal-notice', 'impressum', 'imprint'], href: localePath(locale, '/legal-notice') },
    { keys: ['privacy-policy', 'privacy', 'datenschutz'], href: localePath(locale, '/privacy-policy') }
  ]
}
