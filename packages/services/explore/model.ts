import { z } from "zod";

// ─── Input DTOs ────────────────────────────────────────────────────────────────

export const getTrendingDto = z.object({
  limit: z.number().int().min(1).max(20).default(6),
});

export const getForYouDto = z.object({
  limit: z.number().int().min(1).max(20).default(8),
  type: z.enum(["poll", "petition"]).optional(),
});

/** Cursor-based (offset) paginated For You feed */
export const getForYouPageDto = z.object({
  limit: z.number().int().min(1).max(20).default(8),
  cursor: z.number().int().min(0).default(0),
  type: z.enum(["poll", "petition"]).optional(),
});

export const joinQuizByCodeDto = z.object({
  joinCode: z.string().trim().min(1).max(20),
});

export const searchQuizSessionDto = z.object({
  query: z.string().trim().min(1).max(100),
});

// ─── Inferred input types ──────────────────────────────────────────────────────

export type GetTrendingDtoType = z.infer<typeof getTrendingDto>;
export type GetForYouDtoType = z.infer<typeof getForYouDto>;
export type GetForYouPageDtoType = z.infer<typeof getForYouPageDto>;
export type JoinQuizByCodeDtoType = z.infer<typeof joinQuizByCodeDto>;
export type SearchQuizSessionDtoType = z.infer<typeof searchQuizSessionDto>;

// ─── Output types ──────────────────────────────────────────────────────────────

export type TrendingPollItem = {
  pollId: string;
  title: string;
  slug: string;
  username: string;
  tags: string[];
  todayVotes: number;
  totalVotes: number;
};

export type TrendingPetitionItem = {
  petitionId: string;
  title: string;
  slug: string;
  username: string;
  tags: string[];
  signaturesTarget: number;
  todaySignatures: number;
  totalSignatures: number;
};

export type TrendingResult = {
  polls: TrendingPollItem[];
  petitions: TrendingPetitionItem[];
};

export type ForYouItemType = "poll" | "petition";

export type ForYouItem = {
  type: ForYouItemType;
  id: string;
  title: string;
  slug: string;
  username: string;
  tags: string[];
  relevanceScore: number;
  /** polls only */
  totalVotes?: number;
  /** petitions only */
  totalSignatures?: number;
  signaturesTarget?: number;
};

export type ForYouResult = {
  items: ForYouItem[];
  isPersonalised: boolean;
};

/** Paginated For You result — used by the infinite-scroll endpoint */
export type ForYouPageResult = {
  items: ForYouItem[];
  nextCursor: number | null;
  isPersonalised: boolean;
};

export type JoinQuizResult = {
  sessionId: string;
  status: "waiting" | "active" | "ended";
  quizTitle: string;
  sessionName: string;
  joinCode: string;
  participantCount: number;
};

export type QuizSessionSearchItem = {
  sessionId: string;
  quizTitle: string;
  sessionName: string;
  joinCode: string;
  status: "waiting" | "active" | "ended";
  participantCount: number;
};
