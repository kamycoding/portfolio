import { env } from '../config/env.js';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export type EmailDeliveryErrorCategory = 'network' | 'provider-response' | 'timeout';

export interface EmailNetworkDiagnostics {
  readonly errorName?: string;
  readonly code?: string;
  readonly causeCode?: string;
  readonly syscall?: string;
  readonly hostname?: string;
}

export class EmailDeliveryError extends Error {
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

export interface SendContactEmailInput {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

export type ContactEmailSender = (input: SendContactEmailInput) => Promise<void>;

export async function sendContactEmail(
  input: SendContactEmailInput,
  timeoutMs = env.BREVO_REQUEST_TIMEOUT_MS,
): Promise<void> {
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: env.CONTACT_FROM_NAME,
          email: env.CONTACT_FROM_EMAIL,
        },
        to: [
          {
            email: env.CONTACT_TO_EMAIL,
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
