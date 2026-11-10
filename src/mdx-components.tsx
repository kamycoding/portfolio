import type { MDXComponents } from 'mdx/types'

import Callout from '@/components/blog/mdx/callout'
import CodeBlock from '@/components/blog/mdx/code-block'
import Figure from '@/components/blog/mdx/figure'
import { Takeaways, TLDR } from '@/components/blog/mdx/summary'

/*
 * Highlighting happens at build time in src/lib/blog/rehype.mjs; this mapping only adds the frame around it.
 * Term, Gloss, Dialog and Quiz need a post's learning.json, so the article page passes them per post.
 */
const components: MDXComponents = { pre: CodeBlock, Callout, Figure, TLDR, Takeaways }

export const useMDXComponents = (overrides: MDXComponents = {}): MDXComponents => ({ ...components, ...overrides })
