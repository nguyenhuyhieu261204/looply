import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const schema = z.object({
  APP_NAME: z.string().default("looply"),
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("8000"),
  FRONTEND_URL: z.string().url().optional().default("http://localhost:3000"),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:", result.error.flatten());
  process.exit(1);
}

export const env = result.data;
