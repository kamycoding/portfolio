import type { MDXComponents } from 'mdx/types'

import CodeBlock from '@/components/blog/mdx/code-block'

// Highlighting happens at build time in src/lib/blog/rehype.mjs; this mapping only adds the frame around it.
const components: MDXComponents = { pre: CodeBlock }

export const useMDXComponents = (overrides: MDXComponents = {}): MDXComponents => ({ ...components, ...overrides })
