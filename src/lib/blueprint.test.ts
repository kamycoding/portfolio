import { describe, expect, it } from 'vitest'

import { BUILD_MAX, clampBuild, easeInOut, keyToBuild, planPercent, sheetLabel } from './blueprint'

describe('clampBuild', () => {
  it('keeps the value between 0 and 100 and rounds it', () => {
    expect(clampBuild(-12)).toBe(0)
    expect(clampBuild(140)).toBe(BUILD_MAX)
    expect(clampBuild(42.6)).toBe(43)
  })
})

describe('planPercent', () => {
  it('is the share of the editor shown as plan', () => {
    expect(planPercent(100)).toBe(0)
    expect(planPercent(60)).toBe(40)
    expect(planPercent(0)).toBe(100)
  })
})

describe('keyToBuild', () => {
  it('steps by 5 with arrows and 20 with Page keys', () => {
    expect(keyToBuild('ArrowLeft', 50)).toBe(45)
    expect(keyToBuild('ArrowDown', 50)).toBe(45)
    expect(keyToBuild('ArrowRight', 50)).toBe(55)
    expect(keyToBuild('ArrowUp', 50)).toBe(55)
    expect(keyToBuild('PageDown', 50)).toBe(30)
    expect(keyToBuild('PageUp', 50)).toBe(70)
  })

  it('jumps with Home and End and resets with Escape', () => {
    expect(keyToBuild('Home', 50)).toBe(0)
    expect(keyToBuild('End', 50)).toBe(100)
    expect(keyToBuild('Escape', 20)).toBe(100)
  })

  it('stays inside the range', () => {
    expect(keyToBuild('ArrowRight', 98)).toBe(100)
    expect(keyToBuild('PageDown', 10)).toBe(0)
  })

  it('ignores other keys', () => {
    expect(keyToBuild('Tab', 50)).toBeNull()
    expect(keyToBuild('a', 50)).toBeNull()
  })
})

describe('sheetLabel', () => {
  it('pads sheet and total to two digits', () => {
    expect(sheetLabel(0, 5)).toBe('01/05')
    expect(sheetLabel(11, 12)).toBe('12/12')
  })
})

describe('easeInOut', () => {
  it('starts at 0, ends at 1 and passes the middle at 0.5', () => {
    expect(easeInOut(0)).toBe(0)
    expect(easeInOut(1)).toBe(1)
    expect(easeInOut(0.5)).toBeCloseTo(0.5)
  })
})
