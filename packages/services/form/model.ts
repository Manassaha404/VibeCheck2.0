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

export const publishFormDto = z.object({
  formSlug: z.string().trim(),
});


export const getFormAnalyticsDto = z.object({
  formSlug: z.string().trim(),
});

export const getFormResponsesDto = z.object({
  formSlug: z.string().trim(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
});

export const getPublicFormDto = z.object({
  username: z.string().trim(),
  slug: z.string().trim(),
  password: z.string().optional(),
  editMode: z.boolean().optional().default(false),
});

export const submitStaticFormDto = z.object({
  formId: z.string().uuid(),
  answers: z.record(z.string(), z.any()),
  responseId: z.string().uuid().optional(),
});


export const agentChatDto = z.object({
  formId: z.string().uuid(),
  message: z.string().min(1).max(2000),
});

export const agentGetSessionDto = z.object({
  formId: z.string().uuid(),
});

export const agentClearSessionDto = z.object({
  formId: z.string().uuid(),
});


export type DraftFormDtoType = z.infer<typeof draftFormDto>;
export type getSavedFieldsType = z.infer<typeof getSavedFieldsDto>;
export type SaveDraftFormDtoType = z.infer<typeof saveDraftFormDto>;
export type PublishFormDtoType = z.infer<typeof publishFormDto>;
export type GetFormAnalyticsDtoType = z.infer<typeof getFormAnalyticsDto>;
export type GetFormResponsesDtoType = z.infer<typeof getFormResponsesDto>;
export type GetPublicFormDtoType = z.infer<typeof getPublicFormDto>;
export type AgentChatDtoType = z.infer<typeof agentChatDto>;
export type AgentGetSessionDtoType = z.infer<typeof agentGetSessionDto>;
export type AgentClearSessionDtoType = z.infer<typeof agentClearSessionDto>;
export type SubmitStaticFormDtoType = z.infer<typeof submitStaticFormDto>;

// ── Public form result type ─────────────────────────────────────
export type PublicFormField = {
  fieldId: string;
  label: string;
  type: FieldType;
  placeholder: string | null;
  helperText: string | null;
  isRequired: boolean;
  isPrimary: boolean;
  options: { id: string; value: string }[] | null;
  orderIndex: number;
};

export type PublicFormResult = {
  formId: string;
  title: string;
  description: string | null;
  slug: string;
} & (
  | { access: "granted"; isCommentsAllowed: boolean; fields: PublicFormField[]; previousAnswers?: Record<string, unknown>; responseId?: string }
  | { access: "password_required" }
  | { access: "expired" }
  | { access: "limit_reached" }
  | { access: "already_responded"; allowResponseEdit: boolean; responseId: string }
);

// ── Analytics result types ──────────────────────────────────────
export type FieldType =
  | "short_text"
  | "long_text"
  | "number"
  | "email"
  | "phone"
  | "date"
  | "select"
  | "multi_select"
  | "radio"
  | "checkbox"
  | "file"
  | "rating"
  | "scale"
  | "mood";

export type TextFieldAnalytics = {
  kind: "text";
  samples: string[];
  totalAnswered: number;
};

export type ChoiceFieldAnalytics = {
  kind: "choice";
  options: { label: string; count: number; pct: number }[];
  totalAnswered: number;
};

export type NumericFieldAnalytics = {
  kind: "numeric";
  average: number;
  min: number;
  max: number;
  distribution: { label: string; count: number }[];
  totalAnswered: number;
};

export type MoodFieldAnalytics = {
  kind: "mood";
  distribution: { mood: string; count: number; pct: number }[];
  totalAnswered: number;
};

export type FileFieldAnalytics = {
  kind: "file";
  totalUploads: number;
};

export type DateFieldAnalytics = {
  kind: "date";
  distribution: { label: string; count: number }[];
  totalAnswered: number;
};

export type FieldAnalyticsData =
  | TextFieldAnalytics
  | ChoiceFieldAnalytics
  | NumericFieldAnalytics
  | MoodFieldAnalytics
  | FileFieldAnalytics
  | DateFieldAnalytics;

export type AnalyticsField = {
  fieldId: string;
  label: string;
  type: FieldType;
  orderIndex: number;
  analytics: FieldAnalyticsData;
};

export type WeeklyDataPoint = {
  week: string;
  count: number;
};

// ── Individual response types ───────────────────────────────────
export type FormResponseAnswer = {
  fieldId: string;
  fieldLabel: string;
  fieldType: FieldType;
  isPrimary: boolean;
  value: unknown;
};

export type FormResponseItem = {
  responseId: string;
  respondentIdentity: string; // value of the primary field, or fallback
  respondentAvatar: string;   // initials derived from identity
  submittedAt: string;        // ISO string
  answers: FormResponseAnswer[];
};

export type FormResponsesResult = {
  form: {
    formId: string;
    title: string;
    slug: string;
  };
  fields: {
    fieldId: string;
    label: string;
    type: FieldType;
    isPrimary: boolean;
    orderIndex: number;
  }[];
  responses: FormResponseItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type FormAnalyticsResult = {
  form: {
    formId: string;
    title: string;
    slug: string;
    status: string;
    createdAt: Date;
    responseLimit: number | null;
    expiresAt: Date | null;
  };
  totalResponses: number;
  weeklyResponses: WeeklyDataPoint[];
  fields: AnalyticsField[];
};
