import rehypeShiki from '@shikijs/rehype'
import { transformerMetaHighlight, transformerNotationDiff } from '@shikijs/transformers'

// Keep transformer functions out of the options serialized by Turbopack.
export default function journalHighlighting() {
  return rehypeShiki.call(this, {
    themes: {
      dark: 'dark-plus',
      light: 'light-plus',
      monokai: 'monokai',
      'solarized-dark': 'solarized-dark'
    },
    defaultColor: false,
    transformers: [transformerMetaHighlight(), transformerNotationDiff()]
  })
}
