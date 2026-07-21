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

export const quizStatusEnum = pgEnum("quiz_status", ["active", "archived", "draft" ]);

export const quizzes = pgTable(
  "quizzes",
  {
    quizId: uuid("quiz_id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.userId, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: quizStatusEnum("status").default("draft").notNull(),
    passwordNeeded: boolean("password_needed").default(false).notNull(),
    password: varchar("password", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("quiz_user_id_idx").on(t.userId),
    index("quiz_status_idx").on(t.status),
  ],
);
