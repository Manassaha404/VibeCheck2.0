import {
  pgTable,
  uuid,
  boolean,
  integer,
  timestamp,
  index,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { QuizSessions } from "./quiz-sessions";
import { users } from "./users";

export const quizParticipants = pgTable(
  "quiz_participants",
  {
    participantId: uuid("participant_id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => QuizSessions.sessionId, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.userId, {
      onDelete: "set null",
    }),
    score: integer("score").default(0).notNull(),
    correctCount: integer("correct_count").default(0).notNull(),
    answers: jsonb("answers")
      .$type<{ questionId: string; answer: string; isCorrect: boolean }[]>()
      .default([]),
    isHost: boolean("is_host").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("quiz_participant_session_id_idx").on(t.sessionId),
    index("quiz_participant_user_id_idx").on(t.userId),
    uniqueIndex("quiz_participant_session_user_idx").on(
      t.sessionId,
      t.userId,
    ),
  ],
);
