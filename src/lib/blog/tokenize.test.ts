import { describe, expect, it } from 'vitest'

import { tokenizeLine } from './tokenize'

describe('tokenizeLine', () => {
  it('keeps every character, so the line renders exactly as written', () => {
    const line = "  setTimeout(() => console.log('2'), 0) // later"

    expect(
      tokenizeLine(line)
        .map(token => token.text)
        .join('')
    ).toBe(line)
  })

  it('tells keywords, calls, strings, numbers and comments apart', () => {
    const kinds = Object.fromEntries(tokenizeLine("await load('x', 2) // done").map(token => [token.text, token.kind]))

    expect(kinds).toMatchObject({ await: 'kw', load: 'fn', "'x'": 'str', '2': 'num', '// done': 'com' })
  })
})
