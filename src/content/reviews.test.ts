import { describe, expect, it } from 'vitest'

import { REVIEWS } from './reviews'

describe('REVIEWS', () => {
  it('gives every reviewer a distinct avatar character', () => {
    const avatars = REVIEWS.map(review => review.avatar)

    expect(new Set(avatars).size).toBe(avatars.length)
  })

  it('links every reviewer to an https LinkedIn profile', () => {
    for (const review of REVIEWS) {
      expect(review.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\/[\w-]+\/$/)
    }
  })

  it('has a quote in both languages', () => {
    for (const review of REVIEWS) {
      expect(review.en.trim()).not.toBe('')
      expect(review.de.trim()).not.toBe('')
    }
  })
})
