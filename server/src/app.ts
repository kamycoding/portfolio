import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

import { env } from './config/env.js';
import { createContactRouter } from './routes/contact.route.js';
import type { ContactEmailSender } from './services/email.service.js';

interface CreateAppOptions {
  readonly contactEmailSender?: ContactEmailSender;
  readonly contactRateLimit?: number;
}

export function createApp(options: CreateAppOptions = {}): express.Express {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: '10kb' }));
  app.use(
    cors({
      origin: env.ALLOWED_ORIGIN,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
    }),
  );

  app.use((request, response, next) => {
    const origin = request.headers.origin;

    if (origin && origin !== env.ALLOWED_ORIGIN) {
      response.status(403).json({
        success: false,
        message: 'Origin not allowed.',
      });

      return;
    }

    next();
  });

  const contactRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: options.contactRateLimit ?? 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests. Please try again later.',
    },
  });

  app.get('/api/health', (_request, response) => {
    response.status(200).json({
      success: true,
      message: 'Server is running.',
    });
  });

  app.use('/api/contact', contactRateLimiter);
  app.use('/api', createContactRouter(options.contactEmailSender));

  return app;
}
