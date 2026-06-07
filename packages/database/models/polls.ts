import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const pollStatusEnum = pgEnum("poll_status", [
  "draft",
  "active",
  "closed",
  "archived",
]);

export const polls = pgTable(
  "polls",
  {
    pollId: uuid("poll_id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.userId, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    isPublic: boolean("is_public").default(true).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    status: pollStatusEnum("status").default("draft").notNull(),
    isCommentsAllowed: boolean("is_comments_allowed").default(true).notNull(),
    isMultipleOptionVoteAllowed: boolean("is_multiple_option_vote_allowed")
      .default(false)
      .notNull(),
    closedAt: timestamp("closed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (polls) => [index("poll_user_id_idx").on(polls.userId)],
);
