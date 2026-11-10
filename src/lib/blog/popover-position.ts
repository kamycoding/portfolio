type Anchor = Readonly<{ top: number; bottom: number; left: number }>
type Size = Readonly<{ width: number; height: number }>

const GAP = 6
const MARGIN = 16

// Below the anchor, flipped above when only that fits, kept inside the 16px page gutter horizontally.
export const placePopover = (anchor: Anchor, popover: Size, viewport: Size) => {
  const below = anchor.bottom + GAP
  const above = anchor.top - GAP - popover.height
  const fitsBelow = below + popover.height <= viewport.height - MARGIN
  const side = !fitsBelow && above >= MARGIN ? 'top' : 'bottom'
  const maxLeft = Math.max(MARGIN, viewport.width - MARGIN - popover.width)

  return { side, top: side === 'top' ? above : below, left: Math.min(Math.max(anchor.left, MARGIN), maxLeft) } as const
}
