import assert from 'node:assert/strict';
import { once } from 'node:events';
import { request as httpRequest, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, test } from 'node:test';

import type { ContactEmailSender, SendContactEmailInput } from '../src/services/email.service.js';

process.env.PORT = '3000';
process.env.NODE_ENV = 'test';
process.env.ALLOWED_ORIGIN = 'http://localhost:4200';
process.env.BREVO_API_KEY = 'test-api-key';
process.env.CONTACT_TO_EMAIL = 'recipient@example.com';
process.env.CONTACT_FROM_EMAIL = 'verified-sender@example.com';
process.env.CONTACT_FROM_NAME = 'Portfolio Contact Form';

const { createApp } = await import('../src/app.js');
const { EmailDeliveryError, sendContactEmail } = await import('../src/services/email.service.js');

const validContactRequest = {
  name: 'Kamyar Visitor',
  email: 'visitor@example.com',
  message: 'I would like to discuss a new Angular project.',
  privacyAccepted: true,
  company: '',
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
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

test('returns a safe response and logs only diagnostics when email delivery fails', async () => {
  const emailSender: ContactEmailSender = async () => {
    throw new EmailDeliveryError('provider-response', 500);
  };
  const originalConsoleError = console.error;
  let diagnostics: unknown;
  console.error = (_message: unknown, details: unknown) => {
    diagnostics = details;
  };

  try {
    await withApp(emailSender, async (baseUrl) => {
      const response = await postContact(baseUrl, validContactRequest);
      const body = (await response.json()) as { success: boolean; message: string };

      assert.equal(response.status, 502);
      assert.deepEqual(body, {
        success: false,
        message: 'Your message could not be sent. Please try again in a moment.',
      });
    });
  } finally {
    console.error = originalConsoleError;
  }

  assert.deepEqual(diagnostics, {
    category: 'provider-response',
    providerStatus: 500,
  });
});

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

test('aborts a stalled Brevo request after the configured timeout', async () => {
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
});

async function withApp(
  emailSender: ContactEmailSender,
  run: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const app = createApp({ contactEmailSender: emailSender });
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

function postContact(baseUrl: string, body: object): Promise<TestResponse> {
  const requestBody = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const request = httpRequest(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'content-length': Buffer.byteLength(requestBody),
        'content-type': 'application/json',
        origin: 'http://localhost:4200',
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
