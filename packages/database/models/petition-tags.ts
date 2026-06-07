import { pgTable, uuid, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { petitions } from "./petitions";
import { tags } from "./tags";

export const petitionTags = pgTable("petition_tags", {
  petitionTagId: uuid("petition_tag_id").primaryKey().defaultRandom(),
  petitionId: uuid("petition_id")
    .notNull()
    .references(() => petitions.petitionId, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.tagId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (petitionTags) => [
  uniqueIndex("petition_tag_petition_id_tag_id_idx").on(petitionTags.petitionId, petitionTags.tagId),
  index("petition_tag_tag_id_idx").on(petitionTags.tagId),
]);
