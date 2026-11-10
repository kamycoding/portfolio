import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CLOSE_DELAY, createHoverIntent, OPEN_DELAY } from './hover-intent'

const setup = () => {
  let open = false
  const actions = { open: vi.fn(() => void (open = true)), close: vi.fn<() => void>(), isOpen: () => open }
  const intent = createHoverIntent(actions)

  // The real panel reports its closing through the toggle event.
  actions.close.mockImplementation(() => {
    open = false
    intent.closed()
  })

  return { intent, actions, isOpen: () => open }
}

describe('createHoverIntent', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('opens only after the pointer rests on the word', () => {
    const { intent, actions } = setup()

    intent.enter(true)
    vi.advanceTimersByTime(OPEN_DELAY - 1)
    expect(actions.open).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(actions.open).toHaveBeenCalledOnce()
  })

  it('does not open when the pointer passes over the word', () => {
    const { intent, actions } = setup()

    intent.enter(true)
    vi.advanceTimersByTime(OPEN_DELAY / 2)
    intent.leave()
    vi.advanceTimersByTime(OPEN_DELAY + CLOSE_DELAY)

    expect(actions.open).not.toHaveBeenCalled()
    expect(actions.close).not.toHaveBeenCalled()
  })

  it('stays open while the pointer moves from the word into the panel, and closes after it leaves both', () => {
    const { intent, actions, isOpen } = setup()

    intent.enter(true)
    vi.advanceTimersByTime(OPEN_DELAY)
    intent.leave()
    vi.advanceTimersByTime(CLOSE_DELAY - 1)
    intent.enter(false)
    vi.advanceTimersByTime(CLOSE_DELAY)
    expect(isOpen()).toBe(true)

    intent.leave()
    vi.advanceTimersByTime(CLOSE_DELAY)
    expect(actions.close).toHaveBeenCalledOnce()
    expect(isOpen()).toBe(false)
  })

  it('pins a hover-opened panel on click, so the click does not toggle it closed', () => {
    const { intent, actions } = setup()

    intent.enter(true)
    vi.advanceTimersByTime(OPEN_DELAY)
    expect(intent.pin()).toBe(true)

    intent.leave()
    vi.advanceTimersByTime(CLOSE_DELAY * 2)
    expect(actions.close).not.toHaveBeenCalled()
  })

  it('leaves a click-opened panel alone when the pointer leaves', () => {
    const { intent, actions } = setup()

    expect(intent.pin()).toBe(false)
    intent.leave()
    vi.advanceTimersByTime(CLOSE_DELAY * 2)
    expect(actions.close).not.toHaveBeenCalled()
  })
})
