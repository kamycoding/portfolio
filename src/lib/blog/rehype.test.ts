import { describe, expect, it } from 'vitest'

import journalRehype, { assignHeadingIds, COLOR_REPLACEMENTS, parseFilename, slugify } from './rehype.mjs'

type Node = Record<string, any>

const text = (value: string): Node => ({ type: 'text', value })

const element = (tagName: string, children: Node[] = [], properties: Node = {}): Node => ({
  type: 'element',
  tagName,
  properties,
  children
})

const jsxHeading = (name: string, id: unknown, value: string): Node => ({
  type: 'mdxJsxFlowElement',
  name,
  attributes: [{ type: 'mdxJsxAttribute', name: 'id', value: id }],
  children: [text(value)]
})

const root = (children: Node[]): Node => ({ type: 'root', children })

const codeBlock = (lang: string, code: string) =>
  element('pre', [element('code', [text(code)], { className: [`language-${lang}`] })], {})

const run = async (tree: Node, meta?: string) => {
  if (meta) {
    const code = tree.children.find((node: Node) => node.tagName === 'pre')?.children[0]

    code.data = { meta }
  }

  await journalRehype.call({} as never)(tree as never, { data: {} } as never)

  return tree
}

// Shiki wraps its output in a nested root, so search the whole tree.
const find = (node: Node, test: (node: Node) => boolean): Node | undefined => {
  if (test(node)) return node

  for (const child of node.children ?? []) {
    const found = find(child, test)

    if (found) return found
  }
}

const textOf = (node: Node): string => (node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join(''))

describe('slugify', () => {
  it.each([
    ['Überstunden & Feierabend', 'ueberstunden-feierabend'],
    ['Größe und Maße', 'groesse-und-masse'],
    ['ÄÖÜ ẞ äöü', 'aeoeue-ss-aeoeue'],
    ['Café, naïve résumé', 'cafe-naive-resume'],
    ['  Next.js 16: App Router!  ', 'next-js-16-app-router'],
    ['???', 'section']
  ])('turns %j into %j', (input, slug) => {
    expect(slugify(input)).toBe(slug)
  })
})

describe('assignHeadingIds', () => {
  it('suffixes duplicates and reads text through inline elements', () => {
    const tree = root([
      element('h2', [text('Setup')]),
      element('h3', [text('Setup')]),
      element('h2', [element('code', [text('useEffect')]), text(' cleanup')])
    ])

    expect(assignHeadingIds(tree)).toEqual([
      { id: 'setup', text: 'Setup', depth: 2 },
      { id: 'setup-1', text: 'Setup', depth: 3 },
      { id: 'useeffect-cleanup', text: 'useEffect cleanup', depth: 2 }
    ])
  })

  it('keeps explicit IDs and generates around them, wherever they appear', () => {
    const tree = root([element('h2', [text('Intro')]), jsxHeading('h2', 'intro', 'Custom')])

    expect(assignHeadingIds(tree).map(heading => heading.id)).toEqual(['intro-1', 'intro'])
  })

  it('adds a generated ID to a JSX heading without one as a JSX attribute', () => {
    const heading: Node = { type: 'mdxJsxFlowElement', name: 'h2', attributes: [], children: [text('Größe')] }

    expect(assignHeadingIds(root([heading]))).toEqual([{ id: 'groesse', text: 'Größe', depth: 2 }])
    expect(heading.attributes).toEqual([{ type: 'mdxJsxAttribute', name: 'id', value: 'groesse' }])
    expect(heading).not.toHaveProperty('properties')
  })

  it('never generates a shell ID', () => {
    expect(assignHeadingIds(root([element('h2', [text('Main')])]))[0].id).toBe('main-1')
  })

  it.each([
    ['a reserved ID', [jsxHeading('h2', 'main', 'Main')]],
    ['a duplicate explicit ID', [jsxHeading('h2', 'same', 'One'), jsxHeading('h3', 'same', 'Two')]]
  ])('rejects %s', (_, children) => {
    expect(() => assignHeadingIds(root(children))).toThrow('Duplicate or reserved heading ID')
  })

  it('rejects an ID written as an expression', () => {
    expect(() => assignHeadingIds(root([jsxHeading('h2', { type: 'mdxJsxAttributeValueExpression' }, 'X')]))).toThrow(
      'string literals'
    )
  })
})

describe('parseFilename', () => {
  it('reads the filename attribute next to other meta', () => {
    expect(parseFilename('filename="src/example.ts" {2}')).toBe('src/example.ts')
    expect(parseFilename('{2} filename="a b.ts"')).toBe('a b.ts')
    expect(parseFilename('{2}')).toBeUndefined()
    expect(parseFilename(undefined)).toBeUndefined()
  })
})

// The first run loads Shiki's grammars and themes.
describe('journalRehype', { timeout: 30_000 }, () => {
  it('exports an outline of h2 and h3 only, with the IDs written to the headings', async () => {
    const tree = await run(
      root([
        element('h2', [text('Überstunden & Feierabend')]),
        element('h3', [text('Details')]),
        element('h4', [text('Deep')])
      ])
    )

    const [esm] = tree.children
    const elements = esm.data.estree.body[0].declaration.declarations[0].init.elements

    expect(esm.type).toBe('mdxjsEsm')
    expect(
      elements.map((item: Node) => Object.fromEntries(item.properties.map((p: Node) => [p.key.name, p.value.value])))
    ).toEqual([
      { id: 'ueberstunden-feierabend', text: 'Überstunden & Feierabend', depth: 2 },
      { id: 'details', text: 'Details', depth: 3 }
    ])
    expect(find(tree, node => node.tagName === 'h4')?.properties.id).toBe('deep')
  })

  it('labels code, highlights meta lines and marks diff lines without their markers', async () => {
    const source = 'const a = 1 // [!code --]\nconst b = 2 // [!code ++]\nconst c = 3\n'
    const tree = await run(root([codeBlock('ts', source)]), 'filename="example.ts" {3}')
    const pre = find(tree, node => node.tagName === 'pre')!

    const lines = (find(pre, node => node.tagName === 'code')!.children as Node[]).filter(
      node => node.type === 'element'
    )

    expect(pre.properties['data-filename']).toBe('example.ts')
    expect(pre.properties['data-language']).toBe('ts')
    expect(lines.map(line => line.properties.class)).toEqual([
      ['line', 'diff', 'remove'],
      ['line', 'diff', 'add'],
      ['line', 'highlighted']
    ])
    expect(textOf(pre)).toBe('const a = 1\nconst b = 2\nconst c = 3')
  })

  it('renders a block without a language as plain text lines', async () => {
    const tree = await run(root([element('pre', [element('code', [text('plain\ntext\n')])])]))
    const pre = find(tree, node => node.tagName === 'pre')!

    expect(pre.properties['data-language']).toBe('text')
    expect(find(pre, node => node.properties?.class?.includes('line'))).toBeDefined()
  })

  it('replaces token colours below AA in every theme', async () => {
    const tree = await run(root([codeBlock('ts', '// comment\nconst a = 1\n')]))
    const output = JSON.stringify(tree).toLowerCase()

    expect(output).toContain(`--shiki-monokai:${COLOR_REPLACEMENTS.monokai['#88846f']}`)
    expect(output).toContain(`--shiki-solarized-dark:${COLOR_REPLACEMENTS['solarized-dark']['#586e75']}`)
    expect(output).not.toContain('#88846f')
    expect(output).not.toContain('#586e75')
  })
})
