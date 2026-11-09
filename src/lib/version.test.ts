import { describe, expect, it } from 'vitest'

import pkg from '../../package.json'

import { APP_VERSION, versionLabel } from './version'

describe('versionLabel', () => {
  it('keeps major and minor of a release', () => {
    expect(versionLabel('2.1.0')).toBe('v2.1')
    expect(versionLabel('10.12.3')).toBe('v10.12')
  })

  it('drops prerelease and build parts', () => {
    expect(versionLabel('2.0.0-alpha.0')).toBe('v2.0')
    expect(versionLabel('3.4.5+build.7')).toBe('v3.4')
  })
})

describe('APP_VERSION', () => {
  it('is the version from package.json', () => {
    expect(APP_VERSION).toBe(pkg.version)
    expect(versionLabel(APP_VERSION)).toMatch(/^v\d+\.\d+$/)
  })
})
