import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { polls } from "./polls";
import { users } from "./users";

export const pollViews = pgTable("poll_views", {
  pollViewId: uuid("poll_view_id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id")
    .notNull()
    .references(() => polls.pollId, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.userId, {
    onDelete: "set null",
  }),
  guestToken: uuid("guest_token"),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (pollViews) => [
  index("poll_view_poll_id_idx").on(pollViews.pollId),
  index("poll_view_user_id_idx").on(pollViews.userId),
  index("poll_view_guest_token_idx").on(pollViews.guestToken),
]);
