import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional(),
  CLIENT_URL: z.string(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),
  RAZORPAY_WEBHOOK_SECRET: z.string(),
  RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string(),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
