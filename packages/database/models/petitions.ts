import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";
export const petitionStatusEnum = pgEnum("petition_status", [
  "draft",
  "active",
  "closed",
  "archived",
]);

export const petitions = pgTable("petitions", {
  petitionId: uuid("petition_id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  signaturesTarget: integer("signatures_target").notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  status: petitionStatusEnum("status").default("draft").notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (petitions) => [
  index("petition_user_id_idx").on(petitions.userId),
]);