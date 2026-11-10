// A small JavaScript tokenizer for the interactive article components, which show short snippets on the client and
// cannot use the build-time Shiki highlighting of fenced code blocks. It colours; it does not parse.
export type TokenKind = 'kw' | 'str' | 'com' | 'num' | 'fn' | 'plain'

export type Token = Readonly<{ text: string; kind: TokenKind }>

const KEYWORDS = new Set([
  'async',
  'await',
  'function',
  'const',
  'let',
  'var',
  'return',
  'new',
  'if',
  'else',
  'for',
  'of',
  'in',
  'true',
  'false',
  'null',
  'undefined'
])

// Comment, string, number, identifier, then anything else one character at a time.
const PATTERN =
  /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+|.)/g

export const tokenizeLine = (line: string): Token[] => {
  const tokens: Token[] = []

  for (const match of line.matchAll(PATTERN)) {
    const [text, comment, string, number, word] = match
    const next = line[(match.index ?? 0) + text.length]

    if (comment) tokens.push({ text, kind: 'com' })
    else if (string) tokens.push({ text, kind: 'str' })
    else if (number) tokens.push({ text, kind: 'num' })
    else if (word) tokens.push({ text, kind: KEYWORDS.has(word) ? 'kw' : next === '(' ? 'fn' : 'plain' })
    else tokens.push({ text, kind: 'plain' })
  }

  return tokens
}
