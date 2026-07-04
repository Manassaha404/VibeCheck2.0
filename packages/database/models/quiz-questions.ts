import {
  pgTable,
  uuid,
  varchar,
  boolean,
  integer,
  timestamp,
  index,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { quizzes } from "./quizzes";

export const quizQuestions = pgTable(
  "quiz_questions",
  {
    questionId: uuid("question_id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.quizId, { onDelete: "cascade" }),
    orderIndex: integer("order_index").notNull(),
    text: varchar("text", { length: 1000 }).notNull(),
    options: jsonb("options").$type<{ id?: string; text: string; isCorrect: boolean }[]>(),
    acceptedAnswers: varchar("accepted_answers", { length: 1000 }),
    isTextAnswer: boolean("is_text_answer").default(false).notNull(),
    allowMultipleCorrect: boolean("allow_multiple_correct").default(false).notNull(),
    mediaUrl: varchar("media_url", { length: 1000 }),
    timeLimitSecs: integer("time_limit_secs").default(30).notNull(),
    points: integer("points").default(1000).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("quiz_question_quiz_id_idx").on(t.quizId),
    uniqueIndex("quiz_question_quiz_id_order_index_idx").on(
      t.quizId,
      t.orderIndex,
    ),
  ],
);
