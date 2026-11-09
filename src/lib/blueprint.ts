// Plan/build slider maths for the hero, kept pure so it can be tested without a DOM.

// The slider value is the handle position in percent: 0 shows the full plan, 100 the full build (the rest state).
export const BUILD_MAX = 100

export const clampBuild = (value: number) => Math.min(BUILD_MAX, Math.max(0, Math.round(value)))

// The share of the editor that shows the blueprint, for the slider's spoken value.
export const planPercent = (build: number) => BUILD_MAX - clampBuild(build)

// WAI-ARIA slider keys: arrows step 5, Page keys 20, Home and End jump, Escape resets to the build.
// Returns null for keys the slider does not handle, so they keep their default behaviour.
export const keyToBuild = (key: string, build: number): number | null => {
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      return clampBuild(build - 5)
    case 'ArrowRight':
    case 'ArrowUp':
      return clampBuild(build + 5)
    case 'PageDown':
      return clampBuild(build - 20)
    case 'PageUp':
      return clampBuild(build + 20)
    case 'Home':
      return 0
    case 'End':
    case 'Escape':
      return BUILD_MAX
    default:
      return null
  }
}

// "01/05": the sheet number of a section in a drawing set, like an architectural title block.
export const sheetLabel = (index: number, total: number) =>
  `${String(index + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
