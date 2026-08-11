import { Router } from 'express';

import {
  EmailDeliveryError,
  sendContactEmail,
  type ContactEmailSender,
} from '../services/email.service.js';
import { contactRequestSchema } from '../validators/contact.validator.js';

const SUCCESS_MESSAGE = 'Contact request received successfully.';
const DELIVERY_ERROR_MESSAGE = 'Your message could not be sent. Please try again in a moment.';

export function createContactRouter(emailSender: ContactEmailSender = sendContactEmail): Router {
  const router = Router();

  router.post('/contact', async (request, response) => {
    const result = contactRequestSchema.safeParse(request.body);

    if (!result.success) {
      return response.status(400).json({
        success: false,
        message: 'Invalid form submission.',
      });
    }

    if (result.data.company.trim().length > 0) {
      return response.status(200).json({
        success: true,
        message: SUCCESS_MESSAGE,
      });
    }

    try {
      await emailSender({
        name: result.data.name,
        email: result.data.email,
        message: result.data.message,
      });
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

      console.error('Contact email delivery failed.', diagnostics);

      return response.status(502).json({
        success: false,
        message: DELIVERY_ERROR_MESSAGE,
      });
    }

    return response.status(200).json({
      success: true,
      message: SUCCESS_MESSAGE,
    });
  });

  return router;
}
