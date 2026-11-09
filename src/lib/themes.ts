// Color themes built into VS Code. Each id has a token block in globals.css. "dark" and "light" keep their ids,
// so next-themes' system setting and the values already stored in visitors' browsers stay valid.
export const THEMES = [
  { id: 'light', name: 'Light Modern', scheme: 'light' },
  { id: 'dark', name: 'Dark Modern', scheme: 'dark' },
  { id: 'monokai', name: 'Monokai', scheme: 'dark' },
  { id: 'solarized-dark', name: 'Solarized Dark', scheme: 'dark' }
] as const

export type Theme = (typeof THEMES)[number]

export type ThemeId = Theme['id']

export const THEME_IDS: string[] = THEMES.map(theme => theme.id)

const byId = (id: string | undefined) => THEMES.find(theme => theme.id === id)

// Before the theme is known (server, first render) the site shows Dark Modern, the CSS default.
export const getTheme = (id: string | undefined): Theme => byId(id) ?? THEMES[1]

// Anything that only knows dark and light (the terminal toggle, dark: icons) treats Monokai and Solarized as dark.
export const isDarkTheme = (id: string | undefined) => getTheme(id).scheme === 'dark'

const ALIASES: Readonly<Record<string, ThemeId>> = {
  'dark-modern': 'dark',
  'light-modern': 'light',
  solarized: 'solarized-dark'
}

// "Solarized Dark", "dark-modern" or "monokai" -> a theme id, for the terminal; null when nothing matches.
export const findTheme = (query: string): ThemeId | null => {
  const slug = query
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')

  return (
    ALIASES[slug] ??
    THEMES.find(theme => theme.id === slug || theme.name.toLowerCase().replace(/\s+/g, '-') === slug)?.id ??
    null
  )
}
