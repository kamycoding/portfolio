// Where the visitor is on the page, kept across a language switch. Pure math, the DOM reads live in the hook.
export type SectionBox = Readonly<{ id: string; top: number }>

export type ReadingPosition =
  | Readonly<{ kind: 'top' }>
  | Readonly<{ kind: 'section'; id: string; offset: number }>
  | Readonly<{ kind: 'y'; y: number }>

// Below this the page counts as "at the very top" and stays there.
export const TOP_THRESHOLD = 4

// `tops` are absolute page offsets; `anchor` is the height of the fixed bars, where the reading line starts.
export const capturePosition = (sections: readonly SectionBox[], scrollY: number, anchor = 0): ReadingPosition => {
  if (scrollY <= TOP_THRESHOLD) return { kind: 'top' }

  const line = scrollY + anchor
  let current: SectionBox | undefined

  for (const section of sections) {
    if (section.top <= line && (!current || section.top >= current.top)) current = section
  }

  return current ? { kind: 'section', id: current.id, offset: scrollY - current.top } : { kind: 'y', y: scrollY }
}

// The same offset inside the same section of the new page; the top stays the top.
export const restoreScrollY = (position: ReadingPosition, sections: readonly SectionBox[]) => {
  if (position.kind === 'top') return 0
  if (position.kind === 'y') return position.y

  const section = sections.find(box => box.id === position.id)

  return section ? Math.max(0, section.top + position.offset) : 0
}
