import type { OutlineItem } from './schema'

// Pure helpers behind the article tracker, kept free of the DOM so they can be unit tested.

export type OutlineNode = OutlineItem & Readonly<{ children: OutlineItem[] }>

// h3 entries nest under the h2 before them; an h3 before any h2 stays on the top level.
export const nestOutline = (outline: readonly OutlineItem[]): OutlineNode[] =>
  outline.reduce<OutlineNode[]>((nodes, item) => {
    const parent = nodes.at(-1)

    if (item.depth === 3 && parent?.depth === 2) parent.children.push(item)
    else nodes.push({ ...item, children: [] })

    return nodes
  }, [])

export type Viewport = Readonly<{
  height: number

  // Covered by the fixed top bar and ruler, and by the status bar.
  top: number
  bottom: number
}>

/*
 * The last heading that has reached the reading line is active, -1 before the first one.
 * Once the end of the body is visible, lower headings may never reach the line, so the last visible one wins.
 */
export const getActiveHeading = (tops: readonly number[], line: number, viewport: Viewport, atEnd: boolean) => {
  let active = -1

  tops.forEach((top, index) => {
    if (top <= line || (atEnd && top < viewport.height - viewport.bottom)) active = index
  })

  return active
}

// Share of the article body read: 0 while its top is below the top bar, 1 once its end is visible.
export const getReadingProgress = (bodyTop: number, bodyHeight: number, viewport: Viewport) => {
  const visible = viewport.height - viewport.top - viewport.bottom
  const scrollable = bodyHeight - visible

  if (scrollable <= 0) return bodyTop + bodyHeight <= viewport.height - viewport.bottom ? 1 : 0

  return Math.round(Math.min(1, Math.max(0, (viewport.top - bodyTop) / scrollable)) * 100) / 100
}
