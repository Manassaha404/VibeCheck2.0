import {
  pgTable,
  uuid,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { tags } from "./tags";

export const userTagPreferences = pgTable("user_tag_preferences", {
  userTagPreferenceId: uuid("user_tag_preference_id")
    .primaryKey()
    .defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.tagId, { onDelete: "cascade" }),
  score: integer("score").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (prefs) => [
  uniqueIndex("user_tag_pref_user_id_tag_id_idx").on(prefs.userId, prefs.tagId),
  index("user_tag_pref_user_id_idx").on(prefs.userId),
  index("user_tag_pref_tag_id_idx").on(prefs.tagId),
]);
