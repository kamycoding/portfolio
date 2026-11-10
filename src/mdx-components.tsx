import type { MDXComponents } from 'mdx/types'

import AsyncRaceTimeline from '@/components/blog/mdx/async-race-timeline'
import Callout from '@/components/blog/mdx/callout'
import CodeBlock from '@/components/blog/mdx/code-block'
import EventLoopStepper from '@/components/blog/mdx/event-loop-stepper'
import Figure from '@/components/blog/mdx/figure'
import MainThreadDemo from '@/components/blog/mdx/main-thread-demo'
import OutputPuzzle from '@/components/blog/mdx/output-puzzle'
import { Takeaways, TLDR } from '@/components/blog/mdx/summary'

/*
 * Highlighting happens at build time in src/lib/blog/rehype.mjs; this mapping only adds the frame around it.
 * Term, Gloss, Dialog and Quiz need a post's learning.json, so the article page passes them per post.
 */
const components: MDXComponents = {
  pre: CodeBlock,
  Callout,
  Figure,
  TLDR,
  Takeaways,
  OutputPuzzle,
  EventLoopStepper,
  AsyncRaceTimeline,
  MainThreadDemo
}

export const useMDXComponents = (overrides: MDXComponents = {}): MDXComponents => ({ ...components, ...overrides })
