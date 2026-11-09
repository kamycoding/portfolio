// Pure helpers behind the scroll spy, kept free of the DOM so they can be unit tested.

// The section counts as active once its top passes 40% of the viewport, as in the prototype.
const ACTIVE_LINE = 0.4

// One editor "line" per 24px of scroll, as in the prototype status bar.
const LINE_HEIGHT = 24

export const getActiveIndex = (sectionTops: readonly number[], viewportHeight: number): number => {
  let active = 0

  sectionTops.forEach((top, index) => {
    if (top < viewportHeight * ACTIVE_LINE) active = index
  })

  return active
}

export const getLineNumber = (scrollY: number): number => 1 + Math.round(Math.max(0, scrollY) / LINE_HEIGHT)

export const getProgress = (scrollY: number, scrollableHeight: number): number =>
  scrollableHeight > 0 ? Math.min(1, Math.max(0, scrollY / scrollableHeight)) : 0
