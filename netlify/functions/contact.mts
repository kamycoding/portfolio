import { z } from 'zod';

import { contactRequestSchema } from '../../server/src/validators/contact.validator.ts';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SUCCESS_MESSAGE = 'Contact request received successfully.';
const INVALID_MESSAGE = 'Invalid form submission.';
const DELIVERY_ERROR_MESSAGE = 'Your message could not be sent. Please try again in a moment.';

const functionEnvironmentSchema = z.object({
  BREVO_API_KEY: z.string().min(1),
  BREVO_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  CONTACT_TO_EMAIL: z.email(),
  CONTACT_FROM_EMAIL: z.email(),
  CONTACT_FROM_NAME: z.string().trim().min(1).max(100),
});

type EmailDeliveryErrorCategory = 'network' | 'provider-response' | 'timeout';

interface EmailNetworkDiagnostics {
  readonly errorName?: string;
  readonly code?: string;
  readonly causeCode?: string;
  readonly syscall?: string;
  readonly hostname?: string;
}

class EmailDeliveryError extends Error {
  readonly category: EmailDeliveryErrorCategory;
  readonly providerStatus: number | undefined;
  readonly networkDiagnostics: EmailNetworkDiagnostics;

  constructor(
    category: EmailDeliveryErrorCategory,
    providerStatus?: number,
    networkDiagnostics: EmailNetworkDiagnostics = {},
  ) {
    super('Email delivery failed.');
    this.name = 'EmailDeliveryError';
    this.category = category;
    this.providerStatus = providerStatus;
    this.networkDiagnostics = networkDiagnostics;
  }
}

interface ContactFunctionDependencies {
  readonly environment: Record<string, string | undefined>;
  readonly fetch: typeof globalThis.fetch;
  readonly logError: (message: string, diagnostics: object) => void;
}

const defaultDependencies: ContactFunctionDependencies = {
  environment:
    (
      globalThis as typeof globalThis & {
        process?: { env?: Record<string, string | undefined> };
      }
    ).process?.env ?? {},
  fetch: globalThis.fetch,
  logError: console.error,
};

function jsonResponse(body: object, status: number, headers?: HeadersInit): Response {
  return Response.json(body, { status, headers });
}

function readProperty(value: unknown, property: string): unknown {
  if ((typeof value !== 'object' && typeof value !== 'function') || value === null) {
    return undefined;
  }

  try {
    return Reflect.get(value, property);
  } catch {
    return undefined;
  }
}

function readDiagnosticString(value: unknown, property: string): string | undefined {
  const candidate = readProperty(value, property);

  return typeof candidate === 'string' && candidate.length > 0 && candidate.length <= 200
    ? candidate
    : undefined;
}

function sanitizeNetworkDiagnostics(error: unknown): EmailNetworkDiagnostics {
  const cause = readProperty(error, 'cause');
  const errorName = readDiagnosticString(error, 'name');
  const code = readDiagnosticString(error, 'code');
  const causeCode = readDiagnosticString(cause, 'code');
  const syscall = readDiagnosticString(error, 'syscall') ?? readDiagnosticString(cause, 'syscall');
  const hostname =
    readDiagnosticString(error, 'hostname') ?? readDiagnosticString(cause, 'hostname');

  return {
    ...(errorName === undefined ? {} : { errorName }),
    ...(code === undefined ? {} : { code }),
    ...(causeCode === undefined ? {} : { causeCode }),
    ...(syscall === undefined ? {} : { syscall }),
    ...(hostname === undefined ? {} : { hostname }),
  };
}

async function sendContactEmail(
  input: { readonly name: string; readonly email: string; readonly message: string },
  dependencies: ContactFunctionDependencies,
): Promise<void> {
  const environment = functionEnvironmentSchema.parse(dependencies.environment);
  const abortController = new AbortController();
  const timeout = setTimeout(
    () => abortController.abort(),
    environment.BREVO_REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await dependencies.fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': environment.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: environment.CONTACT_FROM_NAME,
          email: environment.CONTACT_FROM_EMAIL,
        },
        to: [
          {
            email: environment.CONTACT_TO_EMAIL,
          },
        ],
        replyTo: {
          email: input.email,
          name: input.name,
        },
        subject: 'New message from KamyCoding portfolio',
        textContent: [`Name: ${input.name}`, `Email: ${input.email}`, '', input.message].join('\n'),
      }),
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new EmailDeliveryError('provider-response', response.status);
    }
  } catch (error: unknown) {
    if (error instanceof EmailDeliveryError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new EmailDeliveryError('timeout');
    }

    throw new EmailDeliveryError('network', undefined, sanitizeNetworkDiagnostics(error));
  } finally {
    clearTimeout(timeout);
  }
}

export function createContactHandler(
  dependencyOverrides: Partial<ContactFunctionDependencies> = {},
): (request: Request) => Promise<Response> {
  const dependencies = { ...defaultDependencies, ...dependencyOverrides };

  return async (request: Request): Promise<Response> => {
    if (request.method !== 'POST') {
      return jsonResponse(
        { success: false, message: 'Method not allowed.' },
        405,
        { allow: 'POST' },
      );
    }

    let requestBody: unknown;

    try {
      requestBody = await request.json();
    } catch {
      return jsonResponse({ success: false, message: INVALID_MESSAGE }, 400);
    }

    const result = contactRequestSchema.safeParse(requestBody);

    if (!result.success) {
      return jsonResponse({ success: false, message: INVALID_MESSAGE }, 400);
    }

    if (result.data.company.trim().length > 0) {
      return jsonResponse({ success: true, message: SUCCESS_MESSAGE }, 200);
    }

    try {
      await sendContactEmail(
        {
          name: result.data.name,
          email: result.data.email,
          message: result.data.message,
        },
        dependencies,
      );
    } catch (error: unknown) {
      const diagnostics =
        error instanceof EmailDeliveryError
          ? {
              category: error.category,
              ...(error.providerStatus === undefined
                ? {}
                : { providerStatus: error.providerStatus }),
              ...error.networkDiagnostics,
            }
          : { category: 'unexpected' };

      dependencies.logError('Contact email delivery failed.', diagnostics);

      return jsonResponse({ success: false, message: DELIVERY_ERROR_MESSAGE }, 502);
    }

    return jsonResponse({ success: true, message: SUCCESS_MESSAGE }, 200);
  };
}

export default createContactHandler();

export const config = {
  rateLimit: {
    windowLimit: 5,
    windowSize: 180,
    aggregateBy: ['ip', 'domain'],
  },
} as const;
