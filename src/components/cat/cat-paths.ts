// Outline paths of the cat (viewBox 0 0 140 110), shared with the hero blueprint so the drawing matches the real cat.
export const CAT_VIEWBOX_WIDTH = 140

export const CAT_OUTLINE = {
  tail: 'M112 66 C123 70 125 84 119 94 C115 101 120 107 127 103',
  body: 'M34 70 C30 52 44 40 66 38 C90 36 112 44 116 62 L117 70 Z',
  earLeft: 'M21 37 L23 17 L36 28',
  earRight: 'M43 28 L56 17 L57 37',
  head: 'M18 46 C14 32 26 25 39 25 C53 25 62 32 60 46 C58 58 48 62 39 62 C28 62 20 58 18 46Z',
  pawLeft: 'M29.5 66 C27.5 75 39 77 39.5 67',
  pawRight: 'M44.5 66 C42.5 75 54 77 54.5 67'
} as const
