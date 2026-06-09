import {
  pgTable,
  uuid,
  integer,
  timestamp,
  index,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
import { QuizSessions } from "./quiz-sessions";

export type LeaderboardEntry = {
  participantId: string;
  username: string | null;
  totalScore: number;
  rank: number;
  correctCount: number;
};

export type QuestionStat = {
  questionId: string;
  orderIndex: number;
  distribution: number[];
  correctRate: number;
};

export const sessionResults = pgTable(
  "session_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => QuizSessions.sessionId, { onDelete: "cascade" }),
    finalLeaderboard: jsonb("final_leaderboard")
      .notNull()
      .$type<LeaderboardEntry[]>(),
    questionStats: jsonb("question_stats").notNull().$type<QuestionStat[]>(),
    totalParticipants: integer("total_participants").notNull(),
    avgScore: integer("avg_score").notNull(),
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("session_result_session_id_idx").on(t.sessionId),
  ],
);
