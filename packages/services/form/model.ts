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
    .describe("is user edit their response or not"),
});

export type DraftFormDtoType = z.infer<typeof draftFormDto>;

export const saveDraftFormDto = z.object({
  formSlug: z.string().trim(),
  fields: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.enum([
          "short_text",
          "long_text",
          "number",
          "email",
          "phone",
          "date",
          "select",
          "multi_select",
          "radio",
          "checkbox",
          "file",
          "rating",
          "scale",
          "mood",
        ]),
        label: z.string(),
        placeholder: z.string().optional(),
        isRequired: z.boolean().default(false),
        isPrimary: z.boolean().default(false),
        helperText: z.string().optional(),
        options: z.any().optional().nullable(),
      }),
    )
    .optional(),
});

export const getSavedFieldsDto = z.object({
  formSlug: z.string().trim(),
});
export type getSavedFieldsType = z.infer<typeof getSavedFieldsDto>;
export type SaveDraftFormDtoType = z.infer<typeof saveDraftFormDto>;

export const publishFormDto = z.object({
  formSlug: z.string().trim(),
});
export type PublishFormDtoType = z.infer<typeof publishFormDto>;
