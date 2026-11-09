import { z } from 'zod'

import { CONTACT_MAX_BODY_BYTES, contactRequestSchema } from '../../src/lib/contact/contact-schema.ts'

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'
const SUCCESS_MESSAGE = 'Contact request received successfully.'
const INVALID_MESSAGE = 'Invalid form submission.'
const DELIVERY_ERROR_MESSAGE = 'Your message could not be sent. Please try again in a moment.'

// Brevo has to give up before Netlify ends the function, so a longer value from the environment is capped (L4).
const MAX_BREVO_TIMEOUT_MS = 8_000

const functionEnvironmentSchema = z.object({
  BREVO_API_KEY: z.string().min(1),
  BREVO_REQUEST_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(MAX_BREVO_TIMEOUT_MS)
    .transform(milliseconds => Math.min(milliseconds, MAX_BREVO_TIMEOUT_MS)),
  CONTACT_TO_EMAIL: z.email(),
  CONTACT_FROM_EMAIL: z.email(),
  CONTACT_FROM_NAME: z.string().trim().min(1).max(100)
})

type EmailDeliveryErrorCategory = 'network' | 'provider-response' | 'timeout'

interface EmailNetworkDiagnostics {
  readonly errorName?: string
  readonly code?: string
  readonly causeCode?: string
  readonly syscall?: string
  readonly hostname?: string
}

class EmailDeliveryError extends Error {
  readonly category: EmailDeliveryErrorCategory
  readonly providerStatus: number | undefined
  readonly networkDiagnostics: EmailNetworkDiagnostics

  constructor(
    category: EmailDeliveryErrorCategory,
    providerStatus?: number,
    networkDiagnostics: EmailNetworkDiagnostics = {}
  ) {
    super('Email delivery failed.')
    this.name = 'EmailDeliveryError'
    this.category = category
    this.providerStatus = providerStatus
    this.networkDiagnostics = networkDiagnostics
  }
}

interface ContactFunctionDependencies {
  readonly environment: Record<string, string | undefined>
  readonly fetch: typeof globalThis.fetch
  readonly logError: (message: string, diagnostics: object) => void
  readonly logInfo: (message: string, details: object) => void
}

const defaultDependencies: ContactFunctionDependencies = {
  environment:
    (
      globalThis as typeof globalThis & {
        process?: { env?: Record<string, string | undefined> }
      }
    ).process?.env ?? {},
  fetch: globalThis.fetch,
  logError: console.error,
  logInfo: console.info
}

function jsonResponse(body: object, status: number, headers?: HeadersInit): Response {
  return Response.json(body, { status, headers })
}

// Only JSON is accepted: a cross-site HTML form cannot send it without a CORS preflight (L2).
function isJsonRequest(request: Request): boolean {
  const mediaType = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase()

  return mediaType === 'application/json'
}

// Browsers send Origin on every POST; another site's origin is refused (L2). Clients without Origin are not browsers.
function isCrossOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')

  if (origin === null) {
    return false
  }

  try {
    const originHost = new URL(origin).host
    const ownHosts = [new URL(request.url).host, request.headers.get('x-forwarded-host')]

    return !ownHosts.includes(originHost)
  } catch {
    return true
  }
}

// Checks the declared size first, then the real size, before anything is parsed (L5).
async function readLimitedBody(request: Request): Promise<string | undefined> {
  const declaredLength = Number(request.headers.get('content-length') ?? 0)

  if (declaredLength > CONTACT_MAX_BODY_BYTES) {
    return undefined
  }

  const body = await request.text()

  return new TextEncoder().encode(body).byteLength > CONTACT_MAX_BODY_BYTES ? undefined : body
}

function readProperty(value: unknown, property: string): unknown {
  if ((typeof value !== 'object' && typeof value !== 'function') || value === null) {
    return undefined
  }

  try {
    return Reflect.get(value, property)
  } catch {
    return undefined
  }
}

function readDiagnosticString(value: unknown, property: string): string | undefined {
  const candidate = readProperty(value, property)

  return typeof candidate === 'string' && candidate.length > 0 && candidate.length <= 200 ? candidate : undefined
}

function sanitizeNetworkDiagnostics(error: unknown): EmailNetworkDiagnostics {
  const cause = readProperty(error, 'cause')
  const errorName = readDiagnosticString(error, 'name')
  const code = readDiagnosticString(error, 'code')
  const causeCode = readDiagnosticString(cause, 'code')
  const syscall = readDiagnosticString(error, 'syscall') ?? readDiagnosticString(cause, 'syscall')

  const hostname = readDiagnosticString(error, 'hostname') ?? readDiagnosticString(cause, 'hostname')

  return {
    ...(errorName === undefined ? {} : { errorName }),
    ...(code === undefined ? {} : { code }),
    ...(causeCode === undefined ? {} : { causeCode }),
    ...(syscall === undefined ? {} : { syscall }),
    ...(hostname === undefined ? {} : { hostname })
  }
}

// Brevo answers { messageId } on success; a missing or odd body only drops the id from the log.
async function readMessageId(response: Response): Promise<string | undefined> {
  try {
    return readDiagnosticString(await response.json(), 'messageId')
  } catch {
    return undefined
  }
}

async function sendContactEmail(
  input: { readonly name: string; readonly email: string; readonly message: string },
  dependencies: ContactFunctionDependencies
): Promise<string | undefined> {
  const environment = functionEnvironmentSchema.parse(dependencies.environment)
  const abortController = new AbortController()

  const timeout = setTimeout(() => abortController.abort(), environment.BREVO_REQUEST_TIMEOUT_MS)

  try {
    const response = await dependencies.fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': environment.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: environment.CONTACT_FROM_NAME,
          email: environment.CONTACT_FROM_EMAIL
        },
        to: [
          {
            email: environment.CONTACT_TO_EMAIL
          }
        ],
        replyTo: {
          email: input.email,
          name: input.name
        },
        subject: 'New message from KamyCoding portfolio',
        textContent: [`Name: ${input.name}`, `Email: ${input.email}`, '', input.message].join('\n')
      }),
      signal: abortController.signal
    })

    if (!response.ok) {
      throw new EmailDeliveryError('provider-response', response.status)
    }

    return await readMessageId(response)
  } catch (error: unknown) {
    if (error instanceof EmailDeliveryError) {
      throw error
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new EmailDeliveryError('timeout')
    }

    throw new EmailDeliveryError('network', undefined, sanitizeNetworkDiagnostics(error))
  } finally {
    clearTimeout(timeout)
  }
}

export function createContactHandler(
  dependencyOverrides: Partial<ContactFunctionDependencies> = {}
): (request: Request) => Promise<Response> {
  const dependencies = { ...defaultDependencies, ...dependencyOverrides }

  // One log line per rejected request: status and reason only, never header or body values.
  const reject = (status: number, reason: string, message: string, headers?: HeadersInit) => {
    dependencies.logInfo('Contact request rejected.', { category: 'rejected', status, reason })

    return jsonResponse({ success: false, message }, status, headers)
  }

  return async (request: Request): Promise<Response> => {
    if (request.method !== 'POST') {
      return reject(405, 'method', 'Method not allowed.', { allow: 'POST' })
    }

    if (!isJsonRequest(request)) {
      return reject(415, 'content-type', 'Unsupported media type.')
    }

    if (isCrossOrigin(request)) {
      return reject(403, 'origin', 'Cross-origin requests are not allowed.')
    }

    const rawBody = await readLimitedBody(request)

    if (rawBody === undefined) {
      return reject(413, 'size', 'Request body too large.')
    }

    let requestBody: unknown

    try {
      requestBody = JSON.parse(rawBody)
    } catch {
      dependencies.logInfo('Contact validation failed.', {
        category: 'validation',
        rules: [{ field: 'body', rule: 'json' }]
      })

      return jsonResponse({ success: false, message: INVALID_MESSAGE }, 400)
    }

    const result = contactRequestSchema.safeParse(requestBody)

    // Logs only which field broke which rule, never the submitted values.
    if (!result.success) {
      const rules = result.error.issues.map(issue => ({ field: String(issue.path[0] ?? 'body'), rule: issue.code }))

      dependencies.logInfo('Contact validation failed.', { category: 'validation', rules })

      return jsonResponse({ success: false, message: INVALID_MESSAGE }, 400)
    }

    // Bots get the normal success answer, so they learn nothing; the log keeps the request visible.
    if (result.data.company.trim().length > 0) {
      dependencies.logInfo('Contact honeypot triggered.', { category: 'honeypot' })

      return jsonResponse({ success: true, message: SUCCESS_MESSAGE }, 200)
    }

    let messageId: string | undefined

    try {
      messageId = await sendContactEmail(
        {
          name: result.data.name,
          email: result.data.email,
          message: result.data.message
        },
        dependencies
      )
    } catch (error: unknown) {
      const diagnostics =
        error instanceof EmailDeliveryError
          ? {
              category: error.category,
              ...(error.providerStatus === undefined ? {} : { providerStatus: error.providerStatus }),
              ...error.networkDiagnostics
            }
          : { category: 'unexpected' }

      dependencies.logError('Contact email delivery failed.', diagnostics)

      return jsonResponse({ success: false, message: DELIVERY_ERROR_MESSAGE }, 502)
    }

    dependencies.logInfo('Contact email accepted by Brevo.', {
      category: 'accepted',
      ...(messageId === undefined ? {} : { messageId })
    })

    return jsonResponse({ success: true, message: SUCCESS_MESSAGE }, 200)
  }
}

export default createContactHandler()

export const config = {
  rateLimit: {
    windowLimit: 5,
    windowSize: 180,
    aggregateBy: ['ip', 'domain']
  }
} as const
