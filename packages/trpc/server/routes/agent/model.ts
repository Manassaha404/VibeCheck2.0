import { z } from "zod";

const currentFieldSchema = z.object({
  label: z.string(),
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

export const getRealTimeTokenDto = z.object({
  quizId: z.string().optional(),
});

export type generateFormType = z.infer<typeof generateFormDto>;
export type clearHistoryType = z.infer<typeof clearHistoryDto>;
export type CurrentFieldType = z.infer<typeof currentFieldSchema>;

export const storeDocumentsEmbeddingsDto = z.object({
  documentId: z.string().uuid("documentId must be a valid UUID"),
  fileUrl: z.string().url("fileUrl must be a valid URL"),
  quizId: z.string().uuid("quizId must be a valid UUID"),
  conversationId: z.string().uuid("conversationId must be a valid UUID").nullish(),
});

export type StoreDocumentsEmbeddingsDto = z.infer<typeof storeDocumentsEmbeddingsDto>;

export const getDocumentRealTimeTokenDto = z.object({
  quizId: z.string().uuid("quizId must be a valid UUID"),
});

export type GetDocumentRealTimeTokenDto = z.infer<typeof getDocumentRealTimeTokenDto>;

export const runQuizBuilderAgentDto = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  quizId: z.string().uuid("quizId must be a valid UUID"),
  conversationId: z.string().uuid("conversationId must be a valid UUID").nullish(),
});

export const clearQuizBuilderHistoryDto = z.object({
  quizId: z.string().uuid("quizId must be a valid UUID"),
});

export type RunQuizBuilderAgentType = z.infer<typeof runQuizBuilderAgentDto>;
export type ClearQuizBuilderHistoryType = z.infer<typeof clearQuizBuilderHistoryDto>;
