import { describe, expect, it } from 'vitest'

import pkg from '../../package.json'

import { APP_VERSION, buildInfo, versionLabel } from './version'

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

describe('buildInfo', () => {
  const NOW = new Date('2026-11-09T13:30:00Z')

  it('shortens the Netlify commit to seven characters', () => {
    expect(buildInfo({ COMMIT_REF: '5cacd91f3e2b8a7d6c5b4a39281706f5e4d3c2b1' }, NOW)).toEqual({
      commit: '5cacd91',
      version: versionLabel(pkg.version),
      date: '2026-11-09'
    })
  })

  it('falls back to "dev" without a commit, as in local builds', () => {
    expect(buildInfo({}, NOW).commit).toBe('dev')
    expect(buildInfo({ COMMIT_REF: '  ' }, NOW).commit).toBe('dev')
  })

  it('uses the UTC calendar day of the build', () => {
    expect(buildInfo({}, new Date('2026-11-09T23:30:00-02:00')).date).toBe('2026-11-10')
  })
})
