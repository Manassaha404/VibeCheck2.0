import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const formStatusEnum = pgEnum("form_status", [
  "draft",
  "active",
  "closed",
]);

export const quizzes = pgTable(
  "quizzes",
  {
    quizId: uuid("quiz_id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.userId, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: formStatusEnum("status").default("draft").notNull(),
    passwordNeeded: boolean("password_needed").default(false).notNull(),
    password: varchar("password", { length: 255 }),
    joinCode: varchar("join_code", { length: 10 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("quiz_user_id_idx").on(t.userId),
    index("quiz_status_idx").on(t.status),
    uniqueIndex("quiz_join_code_idx").on(t.joinCode),
  ],
);
