import { describe, expect, it } from 'vitest'

import { parseCommand, postCommandLines, postSlugFromArg, suggest } from './terminal'

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

describe('journal commands', () => {
  const lines = postCommandLines(['first-post', 'second-post'])

  it('offers open and cat for every published post', () => {
    expect(lines).toEqual(['open first-post', 'open second-post', 'cat blog/first-post', 'cat blog/second-post'])
  })

  it('completes them after the built-in commands, newest post first', () => {
    expect(suggest('ls b', [], lines)).toBe('ls blog')
    expect(suggest('op', [], lines)).toBe('open first-post')
    expect(suggest('open s', [], lines)).toBe('open second-post')
    expect(suggest('cat', [], lines)).toBe('cat blog/first-post')
    expect(suggest('op', [])).toBeNull()
  })

  it('reads the slug from the forms a visitor may type', () => {
    expect(postSlugFromArg('first-post')).toBe('first-post')
    expect(postSlugFromArg('blog/first-post')).toBe('first-post')
    expect(postSlugFromArg('./blog/first-post/')).toBe('first-post')
    expect(postSlugFromArg('blog/first-post/en.mdx')).toBe('first-post')
    expect(postSlugFromArg('blog')).toBe('')
    expect(postSlugFromArg('blog/')).toBe('')
  })
})
