import { pgTable, uuid, varchar, uniqueIndex } from "drizzle-orm/pg-core";

export const tags = pgTable(
  "tags",
  {
    tagId: uuid("tag_id").primaryKey().defaultRandom(),
    text: varchar("text", { length: 100 }).notNull().unique(),
  },
  (tags) => [uniqueIndex("tag_text_idx")],
);
