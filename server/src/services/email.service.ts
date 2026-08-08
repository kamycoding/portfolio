import { env } from '../config/env.js';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_REQUEST_TIMEOUT_MS = 8_000;

export type EmailDeliveryErrorCategory = 'network' | 'provider-response' | 'timeout';

export class EmailDeliveryError extends Error {
  readonly category: EmailDeliveryErrorCategory;
  readonly providerStatus: number | undefined;

  constructor(category: EmailDeliveryErrorCategory, providerStatus?: number) {
    super('Email delivery failed.');
    this.name = 'EmailDeliveryError';
    this.category = category;
    this.providerStatus = providerStatus;
  }
}

export interface SendContactEmailInput {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

export type ContactEmailSender = (input: SendContactEmailInput) => Promise<void>;

export async function sendContactEmail(
  input: SendContactEmailInput,
  timeoutMs = BREVO_REQUEST_TIMEOUT_MS,
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

    throw new EmailDeliveryError('network');
  } finally {
    clearTimeout(timeout);
  }
}
