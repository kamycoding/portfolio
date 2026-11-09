import { describe, expect, it } from 'vitest'

import { contactRequestSchema, invalidContactFields } from './contact-schema'

const valid = {
  name: 'Kamyar Visitor',
  email: 'visitor@example.com',
  message: 'I would like to talk about a project.',
  privacyAccepted: true
}

describe('contactRequestSchema', () => {
  it('trims the text fields and defaults the honeypot to an empty string', () => {
    const result = contactRequestSchema.parse({ ...valid, name: '  Kamyar Visitor  ', email: ' visitor@example.com ' })

    expect(result).toEqual({ ...valid, company: '' })
  })

  it('rejects control characters inside the name (L3)', () => {
    expect(contactRequestSchema.safeParse({ ...valid, name: 'Kamyar\nBcc: x@example.com' }).success).toBe(false)
    expect(contactRequestSchema.safeParse({ ...valid, name: 'Kamyar\tVisitor' }).success).toBe(false)
  })

  it('keeps line breaks in the message', () => {
    expect(contactRequestSchema.safeParse({ ...valid, message: 'Hello,\n\nI have a project.' }).success).toBe(true)
  })

  it('rejects unknown fields', () => {
    expect(contactRequestSchema.safeParse({ ...valid, extra: 'x' }).success).toBe(false)
  })

  it('enforces the length limits', () => {
    expect(contactRequestSchema.safeParse({ ...valid, name: 'K' }).success).toBe(false)
    expect(contactRequestSchema.safeParse({ ...valid, name: 'K'.repeat(81) }).success).toBe(false)
    expect(contactRequestSchema.safeParse({ ...valid, message: 'too short' }).success).toBe(false)
    expect(contactRequestSchema.safeParse({ ...valid, message: 'x'.repeat(2001) }).success).toBe(false)
    expect(contactRequestSchema.safeParse({ ...valid, email: `${'a'.repeat(250)}@x.de` }).success).toBe(false)
  })
})

describe('invalidContactFields', () => {
  it('returns no fields for a valid request', () => {
    expect(invalidContactFields(valid)).toEqual([])
  })

  it('lists the failed fields in form order', () => {
    expect(
      invalidContactFields({ name: ' ', email: 'not-an-email', message: 'short', privacyAccepted: false })
    ).toEqual(['name', 'email', 'message', 'privacyAccepted'])
  })

  it('counts whitespace-only input as empty', () => {
    expect(invalidContactFields({ ...valid, message: '          ' })).toEqual(['message'])
  })
})
