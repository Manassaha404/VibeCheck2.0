import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { pollQuestions } from "./poll-questions";

export const pollOptions = pgTable("poll_options", {
  pollOptionId: uuid("poll_option_id").primaryKey().defaultRandom(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => pollQuestions.pollQuestionId, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull(),
  text: varchar("text", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (pollOptions) => [
  index("poll_option_question_id_idx").on(pollOptions.questionId),
]);
