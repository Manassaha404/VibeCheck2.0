import { z } from "zod";

const currentFieldSchema = z.object({
  label: z.string(),
  type: z.enum([
    "short_text", "long_text", "number", "email", "phone", "date",
    "select", "multi_select", "radio", "checkbox", "file", "rating", "scale", "mood",
  ]),
  placeholder: z.string().optional(),
  helperText: z.string().optional(),
  isRequired: z.boolean(),
  isPrimary: z.boolean(),
  options: z.array(z.object({ id: z.string(), value: z.string() })).optional(),
});

export const generateFormDto = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  formId: z.string().uuid("formId must be a valid UUID"),
  /** The current fields on the canvas — sent so the agent can add/remove/edit accurately */
  currentFields: z.array(currentFieldSchema).optional(),
});

export const clearHistoryDto = z.object({
  formId: z.string().uuid("formId must be a valid UUID"),
});

export type generateFormType = z.infer<typeof generateFormDto>;
export type clearHistoryType = z.infer<typeof clearHistoryDto>;
export type CurrentFieldType = z.infer<typeof currentFieldSchema>;