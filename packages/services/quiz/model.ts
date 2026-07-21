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

export const updateQuizDto = createQuizDto.extend({
  quizId: z.string().uuid(),
});

export type UpdateQuizInput = z.infer<typeof updateQuizDto>;

// ─── Two-step quiz creation DTOs ─────────────────────────────────────────────

/**
 * Step 1 — create a quiz draft with only title/description and password settings.
 * Returns a quizId so the user can proceed to Step 2 (add questions).
 */
export const initDraftQuizDto = z.object({
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
});

export type InitDraftQuizInput = z.infer<typeof initDraftQuizDto>;

/**
 * Step 2 — attach questions to an existing draft quiz and publish it (status → active).
 */
export const publishDraftQuizDto = z.object({
  quizId: z.string().uuid(),
  questions: z.array(quizQuestionSchema).min(1, "At least one question is required"),
});

export type PublishDraftQuizInput = z.infer<typeof publishDraftQuizDto>;

export const getQuizDashboardDto = z.object({
  quizId: z.string().uuid(),
});
export type GetQuizDashboardDtoType = z.infer<typeof getQuizDashboardDto>;

export const getQuizForEditDto = z.object({
  quizId: z.string().uuid(),
});
export type GetQuizForEditDtoType = z.infer<typeof getQuizForEditDto>;

export const archiveItemDto = z.object({
  quizId: z.string().uuid(),
});
export type ArchiveItemDtoType = z.infer<typeof archiveItemDto>;

export const activateItemDto = z.object({
  quizId: z.string().uuid(),
});
export type ActivateItemDtoType = z.infer<typeof activateItemDto>;

export const deleteItemDto = z.object({
  quizId: z.string().uuid(),
});
export type DeleteItemDtoType = z.infer<typeof deleteItemDto>;

export const makeQuizSessionDto = z.object({
  quizId: z.string().uuid(),
  sessionName: z.string().min(1, "Session name is required"),
});
export type MakeQuizSessionDtoType = z.infer<typeof makeQuizSessionDto>;

export const getSessionAnalyticsDto = z.object({
  sessionId: z.string().uuid(),
});
export type GetSessionAnalyticsDtoType = z.infer<typeof getSessionAnalyticsDto>;

export const getSessionForHostDto = z.object({
  sessionId: z.string().uuid(),
});
export type GetSessionForHostDtoType = z.infer<typeof getSessionForHostDto>;

export const emitQuestionDto = z.object({
  sessionId: z.string().uuid(),
  questionIndex: z.number().int().min(0),
});
export type EmitQuestionDtoType = z.infer<typeof emitQuestionDto>;

export const manuallyActivateSessionDto = z.object({
  sessionId: z.string().uuid(),
});
export type ManuallyActivateSessionDtoType = z.infer<
  typeof manuallyActivateSessionDto
>;

export const endSessionDto = z.object({
  sessionId: z.string().uuid(),
});
export type EndSessionDtoType = z.infer<typeof endSessionDto>;

export const getSessionInfoForParticipantDto = z.object({
  sessionId: z.string().uuid(),
});
export type GetSessionInfoForParticipantDtoType = z.infer<
  typeof getSessionInfoForParticipantDto
>;

export const verifySessionPasswordDto = z.object({
  sessionId: z.string().uuid(),
  password: z.string(),
});
export type VerifySessionPasswordDtoType = z.infer<
  typeof verifySessionPasswordDto
>;

export const getLeaderboardForSessionDto = z.object({
  sessionId: z.string().uuid(),
});
export type GetLeaderboardForSessionDtoType = z.infer<
  typeof getLeaderboardForSessionDto
>;

export const addBonusPointsDto = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  optionIds: z.array(z.string()),
  bonusPoints: z.number().min(0),
});
export type AddBonusPointsDtoType = z.infer<typeof addBonusPointsDto>;

export const recordAnswerDto = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  optionIds: z.array(z.string()),
});
export type RecordAnswerDtoType = z.infer<typeof recordAnswerDto>;
