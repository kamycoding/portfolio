import * as z from 'zod/mini'

// One schema for the form and the Netlify function. zod/mini keeps the client bundle small.
export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 10, max: 2000 },
  company: { max: 200 }
} as const

// Requests above this size are rejected before parsing (security review L5).
export const CONTACT_MAX_BODY_BYTES = 10_000

// Control characters such as line breaks in the name could be used to inject email headers (security review L3).
const NO_CONTROL_CHARACTERS = /^[^\p{Cc}]*$/u

export const contactRequestSchema = z.strictObject({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(CONTACT_LIMITS.name.min),
      z.maxLength(CONTACT_LIMITS.name.max),
      z.regex(NO_CONTROL_CHARACTERS)
    ),
  email: z.string().check(z.trim(), z.maxLength(CONTACT_LIMITS.email.max), z.email()),
  message: z.string().check(z.trim(), z.minLength(CONTACT_LIMITS.message.min), z.maxLength(CONTACT_LIMITS.message.max)),
  privacyAccepted: z.literal(true),

  // Honeypot: people never see it, bots fill it in.
  company: z._default(z.optional(z.string().check(z.maxLength(CONTACT_LIMITS.company.max))), '')
})

export type ContactRequest = z.infer<typeof contactRequestSchema>

export type ContactField = 'name' | 'email' | 'message' | 'privacyAccepted'

const FIELDS: readonly ContactField[] = ['name', 'email', 'message', 'privacyAccepted']

// The form shows one message per field, so it only needs to know which fields failed.
export const invalidContactFields = (input: unknown): ContactField[] => {
  const result = contactRequestSchema.safeParse(input)

  if (result.success) return []

  const failed = new Set(result.error.issues.map(issue => issue.path[0]))

  return FIELDS.filter(field => failed.has(field))
}
