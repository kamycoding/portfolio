import rehypeShiki from '@shikijs/rehype'
import { transformerMetaHighlight, transformerNotationDiff } from '@shikijs/transformers'

// IDs the site shell already uses on article pages; "main" is the skip link target.
const RESERVED_IDS = ['main']
const OUTLINE_DEPTHS = new Set([2, 3])
const HEADING = /^h([1-6])$/

const GERMAN = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss', Ä: 'Ae', Ö: 'Oe', Ü: 'Ue', ẞ: 'SS' }

// Token colours below WCAG AA on their own theme background, raised the least possible (docs/adr/0007).
// Monokai and Solarized reuse the adjusted values of src/app/globals.css where one exists.
export const COLOR_REPLACEMENTS = {
  'dark-plus': { '#000080': '#7676ff', '#646695': '#8183ab', '#808080': '#868686' },
  'light-plus': { '#d16969': '#c84c4c' },
  monokai: {
    '#88846f': '#aba898',
    '#f92672': '#fa4b8a',
    '#75715e': '#948f7a',
    '#f44747': '#f55a5a',
    '#b267e6': '#b670e7',
    '#ae81ffa0': '#ae81ff'
  },
  'solarized-dark': {
    '#586e75': '#879da5',
    '#dc322f': '#e56663',
    '#d33682': '#dd649f',
    '#268bd2': '#3094da',
    '#cb4b16': '#e96630',
    '#6c71c4': '#8488cd'
  }
}

export const slugify = text =>
  text
    .replace(/[äöüßÄÖÜẞ]/g, character => GERMAN[character])
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section'

export const parseFilename = meta => meta?.match(/(?:^|\s)filename="([^"]+)"/)?.[1]

const textOf = node =>
  node.type === 'text' ? node.value : 'children' in node ? node.children.map(textOf).join('') : ''

const headingDepth = node => {
  const name = node.type === 'element' ? node.tagName : node.type === 'mdxJsxFlowElement' ? node.name : undefined
  const match = name && HEADING.exec(name)

  return match ? Number(match[1]) : undefined
}

// Markdown headings are hast elements; authored <h2 id="..."> headings stay MDX JSX nodes.
const explicitId = node => {
  if (node.type === 'element') return typeof node.properties?.id === 'string' ? node.properties.id : undefined

  const attribute = node.attributes.find(item => item.type === 'mdxJsxAttribute' && item.name === 'id')

  if (!attribute) return undefined

  if (typeof attribute.value !== 'string') throw new Error(`Heading IDs must be string literals: "${textOf(node)}".`)

  return attribute.value
}

const collectHeadings = (node, found = []) => {
  if (headingDepth(node)) found.push(node)

  if ('children' in node) node.children.forEach(child => collectHeadings(child, found))

  return found
}

// Explicit IDs are claimed first, so generated ones never collide with them.
export const assignHeadingIds = tree => {
  const headings = collectHeadings(tree)
  const taken = new Set(RESERVED_IDS)
  const explicit = new Map()

  for (const heading of headings) {
    const id = explicitId(heading)

    if (id === undefined) continue

    if (taken.has(id)) throw new Error(`Duplicate or reserved heading ID: "${id}".`)

    taken.add(id)
    explicit.set(heading, id)
  }

  return headings.map(heading => {
    let id = explicit.get(heading)

    if (id === undefined) {
      const base = slugify(textOf(heading))

      id = base

      for (let index = 1; taken.has(id); index++) id = `${base}-${index}`

      taken.add(id)

      // JSX headings have no hast properties; their attributes become the rendered props.
      if (heading.type === 'element') heading.properties.id = id
      else heading.attributes.push({ type: 'mdxJsxAttribute', name: 'id', value: id })
    }

    return { id, text: textOf(heading).trim(), depth: headingDepth(heading) }
  })
}

const literal = value => ({ type: 'Literal', value })

const property = (key, value) => ({
  type: 'Property',
  kind: 'init',
  key: { type: 'Identifier', name: key },
  value: literal(value),
  method: false,
  shorthand: false,
  computed: false
})

// Builds `export const outline = [...]` so the page can render the Outline on the server.
export const outlineExport = outline => ({
  type: 'mdxjsEsm',
  value: '',
  data: {
    estree: {
      type: 'Program',
      sourceType: 'module',
      body: [
        {
          type: 'ExportNamedDeclaration',
          specifiers: [],
          source: null,
          declaration: {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: { type: 'Identifier', name: 'outline' },
                init: {
                  type: 'ArrayExpression',
                  elements: outline.map(item => ({
                    type: 'ObjectExpression',
                    properties: [property('id', item.id), property('text', item.text), property('depth', item.depth)]
                  }))
                }
              }
            ]
          }
        }
      ]
    }
  }
})

const transformerFilename = () => ({
  name: 'journal:filename',
  pre(node) {
    const filename = parseFilename(this.options.meta?.__raw)

    if (filename) node.properties['data-filename'] = filename

    node.properties['data-language'] = this.options.lang
  }
})

// Keep transformer functions out of the options serialized by Turbopack.
export default function journalRehype() {
  const highlight = rehypeShiki.call(this, {
    themes: {
      dark: 'dark-plus',
      light: 'light-plus',
      monokai: 'monokai',
      'solarized-dark': 'solarized-dark'
    },
    defaultColor: false,

    // Blocks without a language still get lines, so the frame and copy work the same everywhere.
    defaultLanguage: 'text',
    colorReplacements: COLOR_REPLACEMENTS,
    transformers: [transformerMetaHighlight(), transformerNotationDiff(), transformerFilename()]
  })

  return async (tree, file) => {
    const outline = assignHeadingIds(tree).filter(heading => OUTLINE_DEPTHS.has(heading.depth))

    tree.children.unshift(outlineExport(outline))

    await highlight(tree, file)
  }
}
