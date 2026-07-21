import {
  pgTable,
  uuid,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { quizzes } from "./quizzes";

export const quizBuilderAgentConversation = pgTable(
  "quiz_building_agent_conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.userId, { onDelete: "cascade" }),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.quizId, { onDelete: "cascade" }),
    history: jsonb("history").notNull().default([]),
    fileUrls: jsonb("file_urls").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("agent_conv_user_quiz_idx").on(t.userId, t.quizId),
    index("quiz_agent_conv_user_idx").on(t.userId),
  ],
);
