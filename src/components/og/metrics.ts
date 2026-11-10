/*
 * Advance widths straight from a TrueType file (head, hhea, hmtx and cmap formats 4 and 12), so the Open Graph title
 * can be measured with the exact font Satori draws, without a font library.
 */
const tables = (font: DataView) => {
  const found = new Map<string, number>()

  for (let index = 0; index < font.getUint16(4); index++) {
    const record = 12 + index * 16
    const tag = String.fromCharCode(...[0, 1, 2, 3].map(offset => font.getUint8(record + offset)))

    found.set(tag, font.getUint32(record + 8))
  }

  return (tag: string) => {
    const offset = found.get(tag)

    if (offset === undefined) throw new Error(`The font has no ${tag} table.`)

    return offset
  }
}

const glyphLookup = (font: DataView, cmap: number) => {
  const subtables = Array.from({ length: font.getUint16(cmap + 2) }, (_, index) => {
    const record = cmap + 4 + index * 8

    return { offset: cmap + font.getUint32(record + 4), format: font.getUint16(cmap + font.getUint32(record + 4)) }
  })

  const segmented = subtables.find(table => table.format === 12)

  if (segmented) {
    const groups = font.getUint32(segmented.offset + 12)

    return (code: number) => {
      for (let index = 0; index < groups; index++) {
        const group = segmented.offset + 16 + index * 12
        const start = font.getUint32(group)

        if (code >= start && code <= font.getUint32(group + 4)) return font.getUint32(group + 8) + code - start
      }

      return 0
    }
  }

  const mapping = subtables.find(table => table.format === 4)

  if (!mapping) throw new Error('The font has no supported cmap subtable.')

  const segments = font.getUint16(mapping.offset + 6) / 2
  const ends = mapping.offset + 14
  const starts = ends + segments * 2 + 2
  const deltas = starts + segments * 2
  const ranges = deltas + segments * 2

  return (code: number) => {
    for (let index = 0; index < segments; index++) {
      if (code > font.getUint16(ends + index * 2)) continue

      const start = font.getUint16(starts + index * 2)

      if (code < start) return 0

      const delta = font.getInt16(deltas + index * 2)
      const range = font.getUint16(ranges + index * 2)

      if (range === 0) return (code + delta) & 0xffff

      const glyph = font.getUint16(ranges + index * 2 + range + (code - start) * 2)

      return glyph === 0 ? 0 : (glyph + delta) & 0xffff
    }

    return 0
  }
}

// Width of a text in em, the sum of its advance widths. Kerning and negative letter spacing only make it narrower.
export const createMeasure = (data: ArrayBuffer | Uint8Array) => {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data)
  const font = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const table = tables(font)
  const unitsPerEm = font.getUint16(table('head') + 18)
  const metrics = font.getUint16(table('hhea') + 34)
  const hmtx = table('hmtx')
  const glyph = glyphLookup(font, table('cmap'))

  const advance = (code: number) => font.getUint16(hmtx + Math.min(glyph(code), metrics - 1) * 4)

  return (text: string) =>
    [...text].reduce((sum, character) => sum + advance(character.codePointAt(0)!), 0) / unitsPerEm
}
