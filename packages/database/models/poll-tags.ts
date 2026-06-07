import { pgTable, uuid, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { polls } from "./polls";
import { tags } from "./tags";

export const pollTags = pgTable("poll_tags", {
  pollTagId: uuid("poll_tag_id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id")
    .notNull()
    .references(() => polls.pollId, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.tagId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (pollTags) => [
  uniqueIndex("poll_tag_poll_id_tag_id_idx").on(pollTags.pollId, pollTags.tagId),
  index("poll_tag_tag_id_idx").on(pollTags.tagId),
]);
