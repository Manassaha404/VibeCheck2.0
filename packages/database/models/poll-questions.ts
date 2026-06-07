import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { polls } from "./polls";

export const pollQuestions = pgTable("poll_questions", {
  pollQuestionId: uuid("poll_question_id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id")
    .notNull()
    .references(() => polls.pollId, { onDelete: "cascade" }),
  text: varchar("text", { length: 500 }).notNull(),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (pollQuestions) => [
  index("poll_question_poll_id_idx").on(pollQuestions.pollId),
]);
