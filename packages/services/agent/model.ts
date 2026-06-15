import { z } from "zod";

export const FieldTypeSchema = z.enum([
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
]);

export const FormFieldSchema = z.object({
  label: z.string().describe("The label or question for the field"),
  type: FieldTypeSchema.describe("The type of the field"),
  placeholder: z
    .string()
    .nullable()
    .describe("Placeholder text for the field input. Set to null if not applicable."),
  helperText: z
    .string()
    .nullable()
    .describe("Additional helper text or description for the field. Set to null if not needed."),
  isRequired: z
    .boolean()
    .default(false)
    .describe("Whether the field must be filled out by the respondent"),
  isPrimary: z
    .boolean()
    .default(false)
    .describe(
      "Whether this field is the primary identifier for the respondent (e.g., their name or email)",
    ),
  options: z
    .array(
      z.object({
        id: z
          .string()
          .describe(
            "A unique identifier for the option (can be a short slug or uuid)",
          ),
        value: z.string().describe("The display value of the option"),
      }),
    )
    .nullable()
    .describe(
      "Options for select, multi_select, radio, and checkbox fields. Set to null for all other types.",
    ),
});

export const FormGenerationSchema = z.object({
  fields: z
    .array(FormFieldSchema)
    .describe("The ordered list of fields that make up the form"),
});

export const GuardrailResultSchema = z.object({
  isValid: z
    .boolean()
    .describe("Whether the content passes the guardrail checks. Must be true or false."),
  reason: z
    .string()
    .nullable()
    .describe("If isValid is false, explain why. If isValid is true, set this to null."),
});

export type GeneratedForm = z.infer<typeof FormGenerationSchema>;
export type GeneratedFormField = z.infer<typeof FormFieldSchema>;
export type GeneratedFieldType = z.infer<typeof FieldTypeSchema>;
export type GuardrailResult = z.infer<typeof GuardrailResultSchema>;
