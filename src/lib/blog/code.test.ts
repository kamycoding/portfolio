import { describe, expect, it, vi } from 'vitest'

import { copyText, readCodeLines, resultingCode } from './code'

const line = (text: string, classes: string[]) => ({
  textContent: text,
  classList: { contains: (name: string) => classes.includes(name) }
})

describe('resultingCode', () => {
  it('drops removed lines and keeps added, highlighted and empty ones', () => {
    const root = {
      querySelectorAll: () => [
        line('const a = 1', ['line', 'diff', 'remove']),
        line('const a = 2', ['line', 'diff', 'add']),
        line('', ['line']),
        line('return a', ['line', 'highlighted'])
      ]
    } as unknown as ParentNode

    expect(resultingCode(readCodeLines(root))).toBe('const a = 2\n\nreturn a')
  })
})

describe('copyText', () => {
  it('writes the text to the clipboard', async () => {
    const writeText = vi.fn(async () => undefined)

    await copyText('code', { writeText })

    expect(writeText).toHaveBeenCalledWith('code')
  })

  it('rejects when the clipboard is unavailable or denied', async () => {
    await expect(copyText('code', undefined)).rejects.toThrow('Clipboard unavailable')
    await expect(copyText('code', { writeText: async () => Promise.reject(new Error('denied')) })).rejects.toThrow(
      'denied'
    )
  })
})
