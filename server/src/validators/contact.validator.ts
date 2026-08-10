import { z } from 'zod';

export const contactRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters long.')
      .max(80, 'Name must not exceed 80 characters.'),

    email: z
      .string()
      .trim()
      .email('Please provide a valid email address.')
      .max(254, 'Email must not exceed 254 characters.'),

    message: z
      .string()
      .trim()
      .min(10, 'Message must be at least 10 characters long.')
      .max(2000, 'Message must not exceed 2000 characters.'),

    privacyAccepted: z.literal(true),

    company: z.string().max(200).optional().default(''),
  })
  .strict();
