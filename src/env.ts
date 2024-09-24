import 'dotenv/config'

import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']).default('sqlite'),
  DATABASE_URL: z.string(),
  BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)
