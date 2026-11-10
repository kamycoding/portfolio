// Hover intent for Term popovers: open after a short rest on the word, close a little after the pointer has left both
// the word and the panel, so it can travel into the panel. A click, Enter, Space or focus inside pins it open.
export const OPEN_DELAY = 150
export const CLOSE_DELAY = 200

type Actions = Readonly<{ open: () => void; close: () => void; isOpen: () => boolean }>

export const createHoverIntent = ({ open, close, isOpen }: Actions) => {
  let timer: ReturnType<typeof setTimeout> | undefined
  let byHover = false

  const clear = () => {
    clearTimeout(timer)
    timer = undefined
  }

  return {
    // The pointer arrived on the word (onTrigger) or on the open panel.
    enter: (onTrigger: boolean) => {
      clear()

      if (onTrigger && !isOpen()) {
        timer = setTimeout(() => {
          byHover = true
          open()
        }, OPEN_DELAY)
      }
    },

    // Only a panel that hover opened closes on its own; a pinned one waits for Escape or light dismiss.
    leave: () => {
      clear()

      if (byHover) timer = setTimeout(close, CLOSE_DELAY)
    },

    // True when the panel was open by hover, so the click that pins it must not also toggle it closed.
    pin: () => {
      const wasHoverOpen = byHover && isOpen()

      clear()
      byHover = false

      return wasHoverOpen
    },

    closed: () => {
      clear()
      byHover = false
    },

    dispose: clear
  }
}
