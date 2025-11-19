import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const schema = z.object({
  APP_NAME: z.string().default("looply"),
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("8000"),
  FRONTEND_URL: z.string().url().optional().default("http://localhost:3000"),

  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string().url(),

  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.number().optional().default(900),
  REFRESH_TOKEN_EXPIRES_IN: z.number().optional().default(604800),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:", result.error.flatten());
  process.exit(1);
}

export const env = result.data;
