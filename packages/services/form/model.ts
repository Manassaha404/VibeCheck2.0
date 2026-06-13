import { z } from "zod";

export const draftFormDto = z.object({
  title: z.string().trim().min(1).max(255).describe("the title of the form"),
  description: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .describe("the description of the form")
    .nullable(),
  slug: z.string().trim().min(1).max(255).describe("the slug for the seo"),
  passwordNeeded: z
    .boolean()
    .default(false)
    .describe("is form password protected or not"),
  password: z.string().min(2).max(255).describe("the password of the form"),
  isCommentsAllowed: z
    .boolean()
    .default(true)
    .describe("is comments on form allowed or not"),
  expiresAt: z.string().nullable().describe("form expiry date"),
  responseLimit: z
    .number()
    .nullable()
    .describe("how many responses form will have"),
  allowResponseEdit: z
    .boolean()
    .default(true)
    .describe("is user edit their response or not")
});
