import { describe, expect, it } from 'vitest'

import { parseCommand, suggest } from './terminal'

describe('parseCommand', () => {
  it('splits name and argument, ignoring case and extra spaces', () => {
    expect(parseCommand('  Git   LOG ')).toEqual({ name: 'git', arg: 'log' })
    expect(parseCommand('ls projects')).toEqual({ name: 'ls', arg: 'projects' })
    expect(parseCommand('clear')).toEqual({ name: 'clear', arg: '' })
  })

  it('returns an empty name for an empty line', () => {
    expect(parseCommand('   ')).toEqual({ name: '', arg: '' })
  })
})

describe('suggest', () => {
  it('shows nothing for an empty prompt', () => {
    expect(suggest('', ['git log'])).toBeNull()
    expect(suggest('  ', [])).toBeNull()
  })

  it('completes from the built-in commands', () => {
    expect(suggest('gi', [])).toBe('git log')
    expect(suggest('ls p', [])).toBe('ls projects')
    expect(suggest('bl', [])).toBe('blueprint')
    expect(suggest('theme l', [])).toBe('theme list')
    expect(suggest('theme so', [])).toBe('theme solarized-dark')
  })

  it('prefers the newest matching history entry', () => {
    expect(suggest('th', ['theme dark', 'theme light'])).toBe('theme light')
  })

  it('keeps what the visitor typed and only adds the rest', () => {
    expect(suggest('GI', [])).toBe('GIt log')
  })

  it('returns null when nothing longer matches', () => {
    expect(suggest('git log', [])).toBeNull()
    expect(suggest('xyz', [])).toBeNull()
  })
})
