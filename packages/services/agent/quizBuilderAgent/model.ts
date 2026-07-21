import { z } from "zod";

export const QuestionTypeSchema = z.enum(["multiple_choice", "text_entry"]);

export const QuizOptionOutputSchema = z.object({
  text: z.string().min(1, "Option text cannot be empty"),
  isCorrect: z.boolean(),
});

// OpenAI Structured Outputs requires all fields to be required (no .optional()).
// Use .nullable() so the model always emits the field (null = no media).
const mediaUrlSchema = z
  .string()
  .nullable()
  .describe("URL of an optional media asset. Set to null if no media.");

export const QuizQuestionSchema = z.object({
  type: QuestionTypeSchema,
  text: z.string().min(1, "Question text cannot be empty"),
  options: z
    .array(QuizOptionOutputSchema)
    .describe("For multiple_choice, 2-6 options. For text_entry, pass an empty array."),
  allowMultipleCorrect: z.boolean().describe("True if multiple options are correct. False for text_entry."),
  timeLimit: z.number().int().positive().describe("Time limit in seconds"),
  points: z.number().int().nonnegative().describe("Points awarded. Should be 0 for text_entry."),
  mediaUrl: mediaUrlSchema,
});

export const QuestionOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema),
  agentMessage: z.string().describe("Message from the agent to the user, explaining the reasoning behind the generated questions."),
});

export type QuestionOutputType = z.infer<typeof QuestionOutputSchema>

// ── Service-layer DTOs ────────────────────────────────────────────────────────

export const runQuizBuilderAgentDto = z.object({
  jobId: z.string(),
  userId: z.string(),
  quizId: z.string(),
  prompt: z.string(),
  conversationId: z.string().optional(),
});

export const clearHistoryDto = z.object({
  userId: z.string(),
  quizId: z.string(),
});

export type RunQuizBuilderAgentType = z.infer<typeof runQuizBuilderAgentDto>;
export type ClearHistoryType = z.infer<typeof clearHistoryDto>;


export const GuardrailResultSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      "Whether the content passes the guardrail checks. Must be true or false.",
    ),
  reason: z
    .string()
    .nullable()
    .describe(
      "If isValid is false, explain why. If isValid is true, set this to null.",
    ),
});
