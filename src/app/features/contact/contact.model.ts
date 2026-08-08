export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly privacyAccepted: boolean;
  readonly company: string;
}

export interface ContactResponse {
  readonly success: boolean;
  readonly message?: string;
}

export type ContactSubmissionState = 'idle' | 'invalid' | 'submitting' | 'success' | 'server-error';
