import {
  pgTable,
  uuid,
  integer,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { quizzes } from "./quizzes";

export const sessionStatusEnum = pgEnum("session_status", [
  "waiting",
  "active",
  "ended",
]);

export const QuizSessions = pgTable(
  "quiz_sessions",
  {
    sessionId: uuid("session_id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.quizId, { onDelete: "cascade" }),
    currentQuestionIndex: integer("current_question_index")
      .default(-1)
      .notNull(),
    status: sessionStatusEnum("status").default("waiting").notNull(),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("quiz_session_quiz_id_idx").on(t.quizId),
    index("quiz_session_status_idx").on(t.status),
  ],
);
