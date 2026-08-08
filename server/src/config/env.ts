import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),

  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  ALLOWED_ORIGIN: z.url(),

  BREVO_API_KEY: z.string().min(1, 'BREVO_API_KEY is required.'),

  CONTACT_TO_EMAIL: z.email(),

  CONTACT_FROM_EMAIL: z.email(),

  CONTACT_FROM_NAME: z.string().trim().min(1, 'CONTACT_FROM_NAME is required.').max(100),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);

  process.exit(1);
}

export const env = parsedEnv.data;
