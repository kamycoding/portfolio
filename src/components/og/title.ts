// Satori measures some Geist words wider than it draws them, which shows as uneven gaps after words such as
// "zweisprachiges". Joining a line's words with no-break spaces moves that surplus to the end of the line.
const NBSP = ' '

export type TitleLayout = Readonly<{ size: number; lines: readonly string[] }>

type LayoutOptions = Readonly<{
  measure: (text: string) => number
  maxWidth: number
  sizes: readonly number[]
}>

/*
 * One line, or two lines split where the wider one is narrowest, at the largest size where every line fits maxWidth.
 * Returns null when nothing fits, so the caller lets the text wrap normally instead of overflowing.
 */
export const layoutTitle = (title: string, { measure, maxWidth, sizes }: LayoutOptions): TitleLayout | null => {
  const words = title.trim().split(/\s+/)
  const join = (part: readonly string[]) => part.join(NBSP)

  const splits = words.slice(1).map((_, index) => [join(words.slice(0, index + 1)), join(words.slice(index + 1))])
  const balanced = splits.sort((a, b) => Math.max(...a.map(measure)) - Math.max(...b.map(measure)))[0]
  const candidates = [[join(words)], ...(balanced ? [balanced] : [])]

  for (const size of sizes) {
    const lines = candidates.find(option => option.every(line => measure(line) * size <= maxWidth))

    if (lines) return { size, lines }
  }

  return null
}
