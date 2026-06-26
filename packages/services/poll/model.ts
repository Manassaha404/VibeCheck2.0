import { z } from "zod";

export const createPollDto = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title is too long").describe("the title of the poll"),
  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .nullable()
    .optional()
    .describe("the description of the poll"),
  isPublic: z
    .boolean()
    .default(true)
    .describe("is the poll visible to everyone"),
  isCommentsAllowed: z
    .boolean()
    .default(true)
    .describe("can viewers comment on the poll"),
  isMultipleOptionVoteAllowed: z
    .boolean()
    .default(false)
    .describe("can voters select multiple options"),
});

export type CreatePollDtoType = z.infer<typeof createPollDto>;

export const savePollDraftDto = z.object({
  question: z
    .object({
      id: z.string().optional().describe("the id of the question if it already exists"),
      text: z.string().trim().min(1, "Question text is required").max(500, "Question text is too long"),
      options: z
        .array(
          z.object({
            id: z.string().optional().describe("the id of the option if it already exists"),
            text: z.string().trim().min(1, "Option text is required").max(500, "Option text is too long"),
            orderIndex: z.number().int().describe("the display order of the option"),
          })
        )
        .min(2, "At least two options are required")
        .describe("the options for the question"),
    })
    .describe("the question for the poll"),
  isPublic: z.boolean().optional().describe("is the poll visible to everyone"),
  isCommentsAllowed: z.boolean().optional().describe("can viewers comment on the poll"),
  isMultipleOptionVoteAllowed: z.boolean().optional().describe("can voters select multiple options"),
  isPublished: z.boolean().optional().describe("is the poll published"),
  status: z.enum(["draft", "active", "archived"]).optional().describe("the status of the poll"),
});

export type SavePollDraftDtoType = z.infer<typeof savePollDraftDto>;

// ─── Analytics ─────────────────────────────────────────────────────────────

export const getPollAnalyticsDto = z.object({
  slug: z.string().min(1),
});

export type GetPollAnalyticsDtoType = z.infer<typeof getPollAnalyticsDto>;

export const submitVoteDto = z.object({
  pollId: z.string().uuid(),
  optionId: z.string().uuid(),
  comment: z.string().trim().max(500).optional(),
});

export type SubmitVoteDtoType = z.infer<typeof submitVoteDto>;

export interface PollAnalyticsOptionResult {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface PollAnalyticsComment {
  id: string;
  username: string;
  text: string;
  timeAgo: string;
}

export interface PollAnalyticsTimeline {
  time: string;
  votes: number;
  cumulative: number;
}

export interface PollAnalyticsResult {
  pollId: string;
  slug: string;
  username: string;
  question: string;
  startedAt: string;
  isLive: boolean;
  totalVotes: number;
  totalViews: number;
  engagementRate: number;
  topAnswer: string;
  options: PollAnalyticsOptionResult[];
  comments: PollAnalyticsComment[];
  voteTimeline: PollAnalyticsTimeline[];
  demographicData: { label: string; value: number }[];
}