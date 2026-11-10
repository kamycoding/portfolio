// Copy helpers for journal code blocks; Shiki marks each rendered line with `.line` and removed diff lines with `.remove`.

export type CodeLine = Readonly<{ text: string; removed: boolean }>

export const readCodeLines = (root: ParentNode): CodeLine[] =>
  Array.from(root.querySelectorAll('.line'), line => ({
    text: line.textContent ?? '',
    removed: line.classList.contains('remove')
  }))

// The code a reader ends up with: removed lines dropped, notation markers already stripped at build time.
export const resultingCode = (lines: readonly CodeLine[]) =>
  lines
    .filter(line => !line.removed)
    .map(line => line.text)
    .join('\n')

// Throws when the Clipboard API is missing (non-secure context) or denied, so the caller can say so.
export const copyText = async (text: string, clipboard: Pick<Clipboard, 'writeText'> | undefined) => {
  if (!clipboard) throw new Error('Clipboard unavailable.')

  await clipboard.writeText(text)
}
