// The two files in the hero editor, as syntax tokens (prototype app.js: codeLines, typesLines).
export type TokenKind = 'kw' | 'str' | 'prop' | 'pun' | 'com' | 'plain'

export type PropKey = 'role' | 'based' | 'stack' | 'building' | 'background' | 'openTo' | 'cat'

export type Token = Readonly<{ kind: TokenKind; text: string; tip?: PropKey }>

export type Comments = Readonly<{
  role: string
  building: string
  background: string
  cat: string
  awake: string
  types: string
}>

const kw = (text: string): Token => ({ kind: 'kw', text })
const str = (text: string): Token => ({ kind: 'str', text })
const pun = (text: string): Token => ({ kind: 'pun', text })
const com = (text: string): Token => ({ kind: 'com', text })
const prop = (text: string): Token => ({ kind: 'prop', text })
const plain = (text: string): Token => ({ kind: 'plain', text })

// Property names with a TypeScript-style hover card.
const key = (tip: PropKey): Token => ({ kind: 'prop', text: tip, tip })

export const kamyarLines = (comments: Comments, catAwake: boolean): Token[][] => [
  [kw('import'), plain(' '), kw('type'), plain(' { Developer } '), kw('from'), plain(' '), str('"@/types"')],
  [],
  [kw('export const'), plain(' kamyar '), pun('='), plain(' {')],
  [plain('  '), key('role'), pun(':'), plain(' '), str('"Full-stack developer"'), plain(',  '), com(comments.role)],
  [plain('  '), key('based'), pun(':'), plain(' '), str('"Cologne, DE"'), plain(',')],
  [
    plain('  '),
    key('stack'),
    pun(':'),
    plain(' ['),
    str('"TypeScript"'),
    plain(', '),
    str('"React"'),
    plain(', '),
    str('"Next.js"'),
    plain(', '),
    str('"Node"'),
    plain('],')
  ],
  [plain('  '), key('building'), pun(':'), plain(' '), str('"Heldio"'), plain(',  '), com(comments.building)],
  [plain('  '), key('background'), pun(':'), plain(' '), str('"Architecture"'), plain(',  '), com(comments.background)],
  [plain('  '), key('openTo'), pun(':'), plain(' ['), str('"full-time"'), plain(', '), str('"freelance"'), plain('],')],
  [
    plain('  '),
    key('cat'),
    pun(':'),
    plain(' { status'),
    pun(':'),
    plain(' '),
    str(catAwake ? '"awake"' : '"asleep"'),
    plain(' },  '),
    com(catAwake ? comments.awake : comments.cat)
  ],
  [plain('} '), kw('satisfies'), plain(' Developer')]
]

export const typesLines = (comments: Comments): Token[][] => [
  [
    kw('export type'),
    plain(' Cat '),
    pun('='),
    plain(' { status'),
    pun(':'),
    plain(' '),
    str('"asleep"'),
    plain(' '),
    pun('|'),
    plain(' '),
    str('"awake"'),
    plain(' }')
  ],
  [],
  [kw('export interface'), plain(' Developer {')],
  [plain('  '), prop('role'), pun(':'), plain(' '), kw('string')],
  [plain('  '), prop('based'), pun(':'), plain(' '), kw('string')],
  [plain('  '), prop('stack'), pun(':'), plain(' '), kw('readonly'), plain(' '), kw('string'), plain('[]')],
  [plain('  '), prop('building'), pun(':'), plain(' '), kw('string'), plain('  '), com(comments.types)],
  [plain('  '), prop('background'), pun(':'), plain(' '), kw('string')],
  [
    plain('  '),
    prop('openTo'),
    pun(':'),
    plain(' ('),
    str('"full-time"'),
    plain(' '),
    pun('|'),
    plain(' '),
    str('"freelance"'),
    plain(')[]')
  ],
  [plain('  '), prop('cat'), pun(':'), plain(' Cat')],
  [plain('}')]
]

// TypeScript signatures shown on top of each hover card (language independent).
export const TIP_SIGNATURES: Readonly<Record<PropKey, string>> = {
  role: '(property) role: string',
  based: '(property) based: Location',
  stack: '(property) stack: readonly Tech[]',
  building: '(property) building: "Heldio"',
  background: '(property) background: "Architecture"',
  openTo: '(property) openTo: Role[]',
  cat: '(property) cat: Cat'
}

// Line of the cat property in kamyar.ts, which flashes when the cat wakes up.
export const CAT_LINE = 9
