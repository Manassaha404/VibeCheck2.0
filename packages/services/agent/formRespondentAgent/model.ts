import { z } from "zod";

export const RespondentFormFieldSchema = z.object({
  fieldId: z.string(),
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
    "rating",
    "scale",
    "mood",
  ]),
  isRequired: z.boolean(),
  placeholder: z.string().nullable(),
  helperText: z.string().nullable(),
  options: z
    .array(z.object({ id: z.string(), value: z.string() }))
    .nullable(),
});

export type RespondentFormField = z.infer<typeof RespondentFormFieldSchema>;



export const CollectedAnswerSchema = z.object({
  fieldId: z.string().describe("The fieldId of the form field this answer belongs to"),
  value: z
    .union([z.string(), z.number(), z.array(z.string())])
    .describe(
      "The respondent's answer. " +
      "For text/email/phone/date/scale/mood fields: a string. " +
      "For number/rating: a number. " +
      "For multi_select/checkbox: an array of option ids or values.",
    ),
});

export type CollectedAnswer = z.infer<typeof CollectedAnswerSchema>;



//output type
export const RespondentAgentOutputSchema = z.object({
  reply: z
    .string()
    .describe(
      "Your next conversational message to the respondent. " +
      "Ask the next unanswered question, confirm a received answer, " +
      "ask for clarification on an invalid answer, or say goodbye when done.",
    ),
  collectedAnswers: z
    .array(CollectedAnswerSchema)
    .describe(
      "The COMPLETE list of answers collected so far across ALL turns — not just the latest one. " +
      "Always carry forward all previously collected answers and append new ones. " +
      "Each entry must have a valid fieldId from the form.",
    ),
  isComplete: z
    .boolean()
    .describe(
      "Set to true ONLY when every required field has a valid answer and you have confirmed with the respondent. " +
      "Set to false during the conversation.",
    ),
  currentFieldId: z
    .string()
    .nullable()
    .describe(
      "The fieldId of the question you are currently asking or just received an answer for. " +
      "Set to null if the conversation has not started yet or is complete.",
    ),
});

export type RespondentAgentOutput = z.infer<typeof RespondentAgentOutputSchema>;


//guardrail schema
export const GuardrailResultSchema = z.object({
  isValid: z
    .boolean()
    .describe("Whether the content passes the guardrail checks. Must be true or false."),
  reason: z
    .string()
    .nullable()
    .describe("If isValid is false, explain why. If isValid is true, set this to null."),
});

export type GuardrailResult = z.infer<typeof GuardrailResultSchema>;



export type RespondentAgentChatResult = {
  reply: string;
  collectedAnswers: CollectedAnswer[];
  isComplete: boolean;
  currentFieldId: string | null;
  responseId?: string;
};
