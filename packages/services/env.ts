import { z } from "zod";

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  ENCRYPTION_SECRET: z.string(),
  OPENAI_API_KEY:z.string(),
  RESEND_API_KEY:z.string(),
  CLIENT_URL:z.string()
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);