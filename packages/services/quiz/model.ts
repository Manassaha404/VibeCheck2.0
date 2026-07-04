import { z } from "zod";

export const quizOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string(),
  isCorrect: z.boolean(),
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["multiple_choice", "text_entry"]),
  text: z.string(),
  options: z.array(quizOptionSchema),
  acceptedAnswers: z.string().optional(),
  timeLimit: z.number(),
  points: z.number(),
  mediaUrl: z.string().optional(),
  allowMultipleCorrect: z.boolean().default(false),
});

export const createQuizDto = z.object({
  info: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
  }),
  globalSettings: z.object({
    passwordProtect: z.boolean(),
    password: z.string().optional(),
    defaultTimeLimit: z.number(),
    defaultPoints: z.number(),
    syncAllQuestions: z.boolean(),
  }),
  questions: z.array(quizQuestionSchema),
});

export type CreateQuizInput = z.infer<typeof createQuizDto>;
