import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";
export const formStatusEnum = pgEnum("form_status", [
  "draft",
  "active",
  "closed",
  "archived",
]);

export const forms = pgTable("forms", {
  formId: uuid("form_id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  isPublished: boolean("is_published").default(false).notNull(),
  status: formStatusEnum("status").default("draft").notNull(),
  allowResponseEdit: boolean("allow_response_edit").default(false).notNull(),
  responseLimit: integer("response_limit"),
  passwordNeeded: boolean("password_needed").default(false).notNull(),
  password: varchar("password", { length: 255 }),
  googleDriveFolderId: varchar("google_drive_folder_id", { length: 255 }),
  isCommentsAllowed: boolean("is_comments_allowed").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (forms) => [
  index("form_user_id_idx").on(forms.userId),
  uniqueIndex("form_slug_idx").on(forms.slug, forms.userId),
  index("form_status_idx").on(forms.status),
]);
