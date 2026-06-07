import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { polls } from "./polls";
import { users } from "./users";

export const pollComments = pgTable("poll_comments", {
  pollCommentId: uuid("poll_comment_id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id")
    .notNull()
    .references(() => polls.pollId, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.userId, {
    onDelete: "set null",
  }),
  guestToken: uuid("guest_token"),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (pollComments) => [
  index("poll_comment_poll_id_idx").on(pollComments.pollId),
]);
