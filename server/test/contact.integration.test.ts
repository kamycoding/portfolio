import assert from 'node:assert/strict';
import { once } from 'node:events';
import { request as httpRequest, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';

import type { ContactEmailSender, SendContactEmailInput } from '../src/services/email.service.js';

process.env.PORT = '3000';
process.env.NODE_ENV = 'test';
process.env.ALLOWED_ORIGIN = 'http://localhost:4200';
process.env.BREVO_API_KEY = 'test-api-key';
process.env.BREVO_REQUEST_TIMEOUT_MS = '17500';
process.env.CONTACT_TO_EMAIL = 'recipient@example.com';
process.env.CONTACT_FROM_EMAIL = 'verified-sender@example.com';
process.env.CONTACT_FROM_NAME = 'Portfolio Contact Form';

const { createApp } = await import('../src/app.js');
const { env, validateEnvironment } = await import('../src/config/env.js');
const { EmailDeliveryError, sendContactEmail } = await import('../src/services/email.service.js');

const validContactRequest = {
  name: 'Kamyar Visitor',
  email: 'visitor@example.com',
  message: 'I would like to discuss a new Angular project.',
  privacyAccepted: true,
  company: '',
};

test('accepts a configured Brevo request timeout', () => {
  assert.equal(env.BREVO_REQUEST_TIMEOUT_MS, 17_500);
});

test('rejects an invalid Brevo request timeout', () => {
  const result = validateEnvironment({
    ...process.env,
    BREVO_REQUEST_TIMEOUT_MS: 'not-a-number',
  });

  assert.equal(result.success, false);

  if (!result.success) {
    assert.ok(result.error.flatten().fieldErrors.BREVO_REQUEST_TIMEOUT_MS?.length);
  }
});

test('uses the safe default when the Brevo request timeout is omitted', () => {
  const environment = { ...process.env };
  delete environment.BREVO_REQUEST_TIMEOUT_MS;

  const result = validateEnvironment(environment);

  assert.equal(result.success, true);

  if (result.success) {
    assert.equal(result.data.BREVO_REQUEST_TIMEOUT_MS, 15_000);
  }
});

test('delivers a valid contact request with the validated Reply-To details', async () => {
  let deliveredMessage: SendContactEmailInput | undefined;
  const emailSender: ContactEmailSender = async (input) => {
    deliveredMessage = input;
  };

  await withApp(emailSender, async (baseUrl) => {
    const response = await postContact(baseUrl, {
      ...validContactRequest,
      name: '  Kamyar Visitor  ',
      email: '  visitor@example.com  ',
    });

    assert.equal(response.status, 200);
    assert.equal(((await response.json()) as { success: boolean }).success, true);
  });

  assert.deepEqual(deliveredMessage, {
    name: 'Kamyar Visitor',
    email: 'visitor@example.com',
    message: validContactRequest.message,
  });
});

test('rejects invalid or unexpected request fields without sending email', async () => {
  let sendCount = 0;
  const emailSender: ContactEmailSender = async () => {
    sendCount += 1;
  };

  await withApp(emailSender, async (baseUrl) => {
    const invalidResponse = await postContact(baseUrl, {
      ...validContactRequest,
      email: 'not-an-email',
    });
    const unexpectedFieldResponse = await postContact(baseUrl, {
      ...validContactRequest,
      unexpected: 'field',
    });

    assert.equal(invalidResponse.status, 400);
    assert.equal(unexpectedFieldResponse.status, 400);
  });

  assert.equal(sendCount, 0);
});

test('returns a fake success for a populated honeypot without sending email', async () => {
  let sendCount = 0;
  const emailSender: ContactEmailSender = async () => {
    sendCount += 1;
  };

  await withApp(emailSender, async (baseUrl) => {
    const response = await postContact(baseUrl, {
      ...validContactRequest,
      company: 'Bot Company',
    });

    assert.equal(response.status, 200);
    assert.equal(((await response.json()) as { success: boolean }).success, true);
  });

  assert.equal(sendCount, 0);
});

test(
  'returns safe responses and logs only available diagnostics when delivery fails',
  { concurrency: false },
  async () => {
    let attempt = 0;
    const emailSender: ContactEmailSender = async () => {
      attempt += 1;
      if (attempt === 1) {
        throw new EmailDeliveryError('provider-response', 500);
      }

      if (attempt === 2) {
        throw new EmailDeliveryError('timeout');
      }

      throw new EmailDeliveryError('network', undefined, {
        errorName: 'TypeError',
        code: 'FETCH_FAILED',
        causeCode: 'ENOTFOUND',
        syscall: 'getaddrinfo',
        hostname: 'api.brevo.com',
      });
    };
    const originalConsoleError = console.error;
    const diagnostics: unknown[] = [];
    console.error = (_message: unknown, details: unknown) => {
      diagnostics.push(details);
    };

    try {
      await withApp(emailSender, async (baseUrl) => {
        const providerResponse = await postContact(baseUrl, validContactRequest);
        const timeoutResponse = await postContact(baseUrl, validContactRequest);
        const networkResponse = await postContact(baseUrl, validContactRequest);
        const providerBody = (await providerResponse.json()) as {
          success: boolean;
          message: string;
        };
        const timeoutBody = (await timeoutResponse.json()) as {
          success: boolean;
          message: string;
        };
        const networkBody = (await networkResponse.json()) as {
          success: boolean;
          message: string;
        };

        assert.equal(providerResponse.status, 502);
        assert.equal(timeoutResponse.status, 502);
        assert.equal(networkResponse.status, 502);
        assert.deepEqual(providerBody, {
          success: false,
          message: 'Your message could not be sent. Please try again in a moment.',
        });
        assert.deepEqual(timeoutBody, {
          success: false,
          message: 'Your message could not be sent. Please try again in a moment.',
        });
        assert.deepEqual(networkBody, {
          success: false,
          message: 'Your message could not be sent. Please try again in a moment.',
        });
      });
    } finally {
      console.error = originalConsoleError;
    }

    assert.deepEqual(diagnostics, [
      { category: 'provider-response', providerStatus: 500 },
      { category: 'timeout' },
      {
        category: 'network',
        errorName: 'TypeError',
        code: 'FETCH_FAILED',
        causeCode: 'ENOTFOUND',
        syscall: 'getaddrinfo',
        hostname: 'api.brevo.com',
      },
    ]);
    const loggedDiagnostics = JSON.stringify(diagnostics);
    assert.equal(loggedDiagnostics.includes(process.env.BREVO_API_KEY ?? ''), false);
    assert.equal(loggedDiagnostics.includes(validContactRequest.name), false);
    assert.equal(loggedDiagnostics.includes(validContactRequest.email), false);
    assert.equal(loggedDiagnostics.includes(validContactRequest.message), false);
  },
);

test('limits repeated contact submissions', async () => {
  let sendCount = 0;
  const emailSender: ContactEmailSender = async () => {
    sendCount += 1;
  };

  await withApp(emailSender, async (baseUrl) => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await postContact(baseUrl, validContactRequest);
      assert.equal(response.status, 200);
    }

    const limitedResponse = await postContact(baseUrl, validContactRequest);
    assert.equal(limitedResponse.status, 429);
  });

  assert.equal(sendCount, 5);
});

test('ignores forwarded headers for rate-limit identity without disabling limiting', async () => {
  let sendCount = 0;
  const emailSender: ContactEmailSender = async () => {
    sendCount += 1;
  };

  await withApp(
    emailSender,
    async (baseUrl) => {
      for (const forwardedFor of ['203.0.113.10', '203.0.113.11']) {
        const response = await postContact(baseUrl, validContactRequest, {
          'x-forwarded-for': forwardedFor,
        });
        assert.equal(response.status, 200);
      }

      const limitedResponse = await postContact(baseUrl, validContactRequest, {
        'x-forwarded-for': '203.0.113.12',
      });
      assert.equal(limitedResponse.status, 429);
    },
    2,
  );

  assert.equal(sendCount, 2);
});

test('keeps the health endpoint independent from contact email delivery', async () => {
  const emailSender: ContactEmailSender = async () => {
    throw new EmailDeliveryError('network');
  };

  await withApp(emailSender, async (baseUrl) => {
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    assert.equal(healthResponse.status, 200);
    assert.deepEqual(await healthResponse.json(), {
      success: true,
      message: 'Server is running.',
    });

    assert.equal((await postContact(baseUrl, validContactRequest)).status, 502);
    assert.equal((await fetch(`${baseUrl}/api/health`)).status, 200);
  });
});

test(
  'preserves only allow-listed network diagnostics from a failed Brevo fetch',
  { concurrency: false },
  async () => {
    const originalFetch = globalThis.fetch;

    try {
      globalThis.fetch = (async () => {
        const cause = Object.assign(new Error('DNS lookup included unsafe details.'), {
          code: 'ENOTFOUND',
          syscall: 'getaddrinfo',
          hostname: 'api.brevo.com',
          apiKey: process.env.BREVO_API_KEY,
          requestBody: validContactRequest.message,
        });
        const error = Object.assign(new TypeError('fetch failed', { cause }), {
          code: 'FETCH_FAILED',
          requestBody: validContactRequest,
        });

        throw error;
      }) as typeof fetch;

      await assert.rejects(
        sendContactEmail({
          name: validContactRequest.name,
          email: validContactRequest.email,
          message: validContactRequest.message,
        }),
        (error: unknown) => {
          assert.ok(error instanceof EmailDeliveryError);
          assert.equal(error.category, 'network');
          assert.deepEqual(error.networkDiagnostics, {
            errorName: 'TypeError',
            code: 'FETCH_FAILED',
            causeCode: 'ENOTFOUND',
            syscall: 'getaddrinfo',
            hostname: 'api.brevo.com',
          });
          assert.equal(JSON.stringify(error.networkDiagnostics).includes('test-api-key'), false);
          assert.equal(
            JSON.stringify(error.networkDiagnostics).includes(validContactRequest.message),
            false,
          );
          return true;
        },
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  },
);

test(
  'aborts a stalled Brevo request after the configured timeout',
  { concurrency: false },
  async () => {
    const originalFetch = globalThis.fetch;

    try {
      globalThis.fetch = ((_input: string | URL | Request, init?: RequestInit) => {
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => {
              const error = new Error('Request aborted.');
              error.name = 'AbortError';
              reject(error);
            },
            { once: true },
          );
        });
      }) as typeof fetch;

      await assert.rejects(
        sendContactEmail(
          {
            name: validContactRequest.name,
            email: validContactRequest.email,
            message: validContactRequest.message,
          },
          5,
        ),
        (error: unknown) => error instanceof EmailDeliveryError && error.category === 'timeout',
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  },
);

async function withApp(
  emailSender: ContactEmailSender,
  run: (baseUrl: string) => Promise<void>,
  contactRateLimit?: number,
): Promise<void> {
  const app = createApp({ contactEmailSender: emailSender, contactRateLimit });
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');

  const address = server.address() as AddressInfo;

  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await closeServer(server);
  }
}

interface TestResponse {
  readonly status: number;
  json(): Promise<unknown>;
}

function postContact(
  baseUrl: string,
  body: object,
  headers: Record<string, string> = {},
): Promise<TestResponse> {
  const requestBody = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const request = httpRequest(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'content-length': Buffer.byteLength(requestBody),
        'content-type': 'application/json',
        origin: 'http://localhost:4200',
        ...headers,
      },
    });
    const chunks: Buffer[] = [];

    request.on('response', (response) => {
      response.on('data', (chunk: Buffer) => chunks.push(chunk));
      response.on('end', () => {
        const responseBody = Buffer.concat(chunks).toString('utf8');

        resolve({
          status: response.statusCode ?? 0,
          async json(): Promise<unknown> {
            return JSON.parse(responseBody) as unknown;
          },
        });
      });
    });
    request.on('error', reject);
    request.end(requestBody);
  });
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}
