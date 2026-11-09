import { describe, expect, it } from 'vitest'

import { findTheme, getTheme, isDarkTheme, THEME_IDS } from './themes'

describe('THEME_IDS', () => {
  it('keeps dark and light for the system setting', () => {
    expect(THEME_IDS).toEqual(expect.arrayContaining(['dark', 'light', 'monokai', 'solarized-dark']))
  })
})

describe('getTheme', () => {
  it('falls back to Dark Modern for unknown or missing ids', () => {
    expect(getTheme(undefined).name).toBe('Dark Modern')
    expect(getTheme('system').name).toBe('Dark Modern')
    expect(getTheme('monokai').name).toBe('Monokai')
  })
})

describe('isDarkTheme', () => {
  it('puts Monokai and Solarized Dark on the dark side', () => {
    expect(isDarkTheme('dark')).toBe(true)
    expect(isDarkTheme('monokai')).toBe(true)
    expect(isDarkTheme('solarized-dark')).toBe(true)
    expect(isDarkTheme('light')).toBe(false)
  })
})

describe('findTheme', () => {
  it('accepts ids, VS Code names and aliases in any case', () => {
    expect(findTheme('monokai')).toBe('monokai')
    expect(findTheme('Solarized Dark')).toBe('solarized-dark')
    expect(findTheme('solarized')).toBe('solarized-dark')
    expect(findTheme('Dark Modern')).toBe('dark')
    expect(findTheme('light-modern')).toBe('light')
    expect(findTheme(' LIGHT ')).toBe('light')
  })

  it('returns null for unknown names', () => {
    expect(findTheme('dracula')).toBeNull()
    expect(findTheme('')).toBeNull()
  })
})
