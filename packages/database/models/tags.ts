import { pgTable, uuid, varchar, uniqueIndex } from "drizzle-orm/pg-core";

export const tags = pgTable(
  "tags",
  {
    tagId: uuid("tag_id").primaryKey().defaultRandom(),
    text: varchar("text", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
  },
  (tags) => [uniqueIndex("tag_slug_idx").on(tags.slug)],
);
