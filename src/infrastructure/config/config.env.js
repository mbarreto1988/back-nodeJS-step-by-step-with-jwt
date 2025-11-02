import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),

  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.coerce.number().int().default(1433),
  DB_ENCRYPT: z.coerce.boolean().default(false),
  DB_TRUST_SERVER_CERT: z.coerce.boolean().default(true),

  DB_POOL_MIN: z.coerce.number().int().nonnegative().default(0),
  DB_POOL_MAX: z.coerce.number().int().positive().default(10),
  DB_POOL_IDLE: z.coerce.number().int().nonnegative().default(30000),

    // 🔐 JWT
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().transform((v) => v.trim().replace(/^"|"$/g, '')).default('1h'),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().default(7),

  // 🧂 Bcrypt
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10)
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Config inválida:');
  console.error(z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;