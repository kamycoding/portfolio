import { describe, expect, it, vi } from 'vitest'

import { config, createContactHandler } from '../functions/contact.mts'

const environment: Record<string, string | undefined> = {
  BREVO_API_KEY: 'test-api-key',
  BREVO_REQUEST_TIMEOUT_MS: '15000',
  CONTACT_TO_EMAIL: 'recipient@example.com',
  CONTACT_FROM_EMAIL: 'verified-sender@example.com',
  CONTACT_FROM_NAME: 'Portfolio Contact Form'
}

const validContactRequest = {
  name: 'Kamyar Visitor',
  email: 'visitor@example.com',
  message: 'I would like to discuss a new Angular project.',
  privacyAccepted: true,
  company: ''
}

function contactRequest(body: unknown, method = 'POST'): Request {
  return new Request('https://kamycoding.com/api/contact', {
    method,
    headers: { 'content-type': 'application/json' },
    ...(method === 'POST' ? { body: JSON.stringify(body) } : {})
  })
}

describe('Netlify contact function', () => {
  it('sends a validated contact email and returns the existing success contract', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 201 }))
    const handler = createContactHandler({ environment, fetch: fetchMock })

    const response = await handler(
      contactRequest({
        ...validContactRequest,
        name: '  Kamyar Visitor  ',
        email: '  visitor@example.com  '
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: 'Contact request received successfully.'
    })
    expect(fetchMock).toHaveBeenCalledOnce()

    const [, requestInit] = fetchMock.mock.calls[0] ?? []

    expect(JSON.parse(String(requestInit?.body))).toEqual({
      sender: {
        name: 'Portfolio Contact Form',
        email: 'verified-sender@example.com'
      },
      to: [{ email: 'recipient@example.com' }],
      replyTo: {
        email: 'visitor@example.com',
        name: 'Kamyar Visitor'
      },
      subject: 'New message from KamyCoding portfolio',
      textContent: 'Name: Kamyar Visitor\nEmail: visitor@example.com\n\nI would like to discuss a new Angular project.'
    })
  })

  it('returns 400 for an invalid payload without calling Brevo', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    const handler = createContactHandler({ environment, fetch: fetchMock })

    const response = await handler(contactRequest({ ...validContactRequest, email: 'not-an-email' }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: 'Invalid form submission.'
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns fake success for a populated honeypot without calling Brevo', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    const handler = createContactHandler({ environment, fetch: fetchMock })

    const response = await handler(contactRequest({ ...validContactRequest, company: 'Bot Company' }))

    expect(response.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns the generic 502 for a Brevo provider response error', async () => {
    const logError = vi.fn()

    const handler = createContactHandler({
      environment,
      fetch: vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 })),
      logError
    })

    const response = await handler(contactRequest(validContactRequest))

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: 'Your message could not be sent. Please try again in a moment.'
    })
    expect(logError).toHaveBeenCalledWith('Contact email delivery failed.', {
      category: 'provider-response',
      providerStatus: 503
    })
  })

  it('returns a safe 502 and logs only allow-listed network diagnostics', async () => {
    const cause = Object.assign(new Error('unsafe provider details'), {
      code: 'UND_ERR_CONNECT_TIMEOUT',
      syscall: 'connect',
      hostname: 'api.brevo.com',
      apiKey: environment.BREVO_API_KEY,
      requestBody: validContactRequest
    })

    const logError = vi.fn()

    const handler = createContactHandler({
      environment,
      fetch: vi.fn<typeof fetch>().mockRejectedValue(new TypeError('fetch failed', { cause })),
      logError
    })

    const response = await handler(contactRequest(validContactRequest))
    const responseBody = await response.json()

    expect(response.status).toBe(502)
    expect(responseBody).toEqual({
      success: false,
      message: 'Your message could not be sent. Please try again in a moment.'
    })
    expect(logError).toHaveBeenCalledWith('Contact email delivery failed.', {
      category: 'network',
      errorName: 'TypeError',
      causeCode: 'UND_ERR_CONNECT_TIMEOUT',
      syscall: 'connect',
      hostname: 'api.brevo.com'
    })

    const serializedOutput = JSON.stringify([responseBody, logError.mock.calls])

    expect(serializedOutput).not.toContain(environment.BREVO_API_KEY)
    expect(serializedOutput).not.toContain(validContactRequest.name)
    expect(serializedOutput).not.toContain(validContactRequest.email)
    expect(serializedOutput).not.toContain(validContactRequest.message)
  })

  it('aborts a stalled Brevo request and returns the generic 502', async () => {
    const logError = vi.fn()

    const fetchMock = vi.fn<typeof fetch>((_input, init) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener(
          'abort',
          () => {
            const error = new Error('Request aborted.')

            error.name = 'AbortError'
            reject(error)
          },
          { once: true }
        )
      })
    })

    const handler = createContactHandler({
      environment: { ...environment, BREVO_REQUEST_TIMEOUT_MS: '5' },
      fetch: fetchMock,
      logError
    })

    const response = await handler(contactRequest(validContactRequest))

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: 'Your message could not be sent. Please try again in a moment.'
    })
    expect(logError).toHaveBeenCalledWith('Contact email delivery failed.', {
      category: 'timeout'
    })
  })

  it('returns a controlled 405 for unsupported methods', async () => {
    const handler = createContactHandler({ environment, fetch: vi.fn<typeof fetch>() })
    const response = await handler(contactRequest(undefined, 'GET'))

    expect(response.status).toBe(405)
    expect(response.headers.get('allow')).toBe('POST')
  })

  it('configures native per-IP rate limiting', () => {
    expect(config).toEqual({
      rateLimit: {
        windowLimit: 5,
        windowSize: 180,
        aggregateBy: ['ip', 'domain']
      }
    })
  })

  describe('security review findings', () => {
    const handlerWithoutBrevo = () => {
      const fetchMock = vi.fn<typeof fetch>()

      return { fetchMock, handler: createContactHandler({ environment, fetch: fetchMock }) }
    }

    it('answers 415 for anything but JSON (L2)', async () => {
      const { fetchMock, handler } = handlerWithoutBrevo()

      for (const contentType of ['text/plain', 'application/x-www-form-urlencoded', 'multipart/form-data']) {
        const response = await handler(
          new Request('https://kamycoding.com/api/contact', {
            method: 'POST',
            headers: { 'content-type': contentType },
            body: JSON.stringify(validContactRequest)
          })
        )

        expect(response.status).toBe(415)
      }

      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('accepts JSON with a charset parameter (L2)', async () => {
      const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 201 }))
      const handler = createContactHandler({ environment, fetch: fetchMock })

      const response = await handler(
        new Request('https://kamycoding.com/api/contact', {
          method: 'POST',
          headers: { 'content-type': 'application/json; charset=utf-8' },
          body: JSON.stringify(validContactRequest)
        })
      )

      expect(response.status).toBe(200)
    })

    it('answers 403 for a request from another origin (L2)', async () => {
      const { fetchMock, handler } = handlerWithoutBrevo()

      const response = await handler(
        new Request('https://kamycoding.com/api/contact', {
          method: 'POST',
          headers: { 'content-type': 'application/json', origin: 'https://evil.example' },
          body: JSON.stringify(validContactRequest)
        })
      )

      expect(response.status).toBe(403)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('accepts the own origin, also behind a proxy host (L2)', async () => {
      const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 201 }))
      const handler = createContactHandler({ environment, fetch: fetchMock })

      const sameHost = await handler(
        new Request('https://kamycoding.com/api/contact', {
          method: 'POST',
          headers: { 'content-type': 'application/json', origin: 'https://kamycoding.com' },
          body: JSON.stringify(validContactRequest)
        })
      )

      const forwardedHost = await handler(
        new Request('https://internal.netlify.example/.netlify/functions/contact', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            origin: 'https://kamycoding.com',
            'x-forwarded-host': 'kamycoding.com'
          },
          body: JSON.stringify(validContactRequest)
        })
      )

      expect(sameHost.status).toBe(200)
      expect(forwardedHost.status).toBe(200)
    })

    it('rejects names with control characters before calling Brevo (L3)', async () => {
      const { fetchMock, handler } = handlerWithoutBrevo()

      const response = await handler(
        contactRequest({ ...validContactRequest, name: 'Kamyar\r\nBcc: someone@example.com' })
      )

      expect(response.status).toBe(400)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('caps the Brevo timeout at 8 seconds even if the environment sets more (L4)', async () => {
      vi.useFakeTimers()

      try {
        let aborted = false

        const fetchMock = vi.fn<typeof fetch>((_input, init) => {
          return new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              aborted = true

              const error = new Error('Request aborted.')

              error.name = 'AbortError'
              reject(error)
            })
          })
        })

        const handler = createContactHandler({
          environment: { ...environment, BREVO_REQUEST_TIMEOUT_MS: '60000' },
          fetch: fetchMock,
          logError: vi.fn()
        })

        const pending = handler(contactRequest(validContactRequest))

        await vi.advanceTimersByTimeAsync(7_999)
        expect(aborted).toBe(false)

        await vi.advanceTimersByTimeAsync(1)
        expect(aborted).toBe(true)
        expect((await pending).status).toBe(502)
      } finally {
        vi.useRealTimers()
      }
    })

    it('answers 413 when the declared size is above the limit (L5)', async () => {
      const { fetchMock, handler } = handlerWithoutBrevo()

      const response = await handler(
        new Request('https://kamycoding.com/api/contact', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'content-length': '10001' },
          body: '{}'
        })
      )

      expect(response.status).toBe(413)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('answers 413 when the real body is above the limit (L5)', async () => {
      const { fetchMock, handler } = handlerWithoutBrevo()

      const response = await handler(contactRequest({ ...validContactRequest, message: 'x'.repeat(10_001) }))

      expect(response.status).toBe(413)
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})
