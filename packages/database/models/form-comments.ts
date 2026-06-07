import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { forms } from "./forms";
import { users } from "./users";

export const formComments = pgTable("form_comments", {
  formCommentId: uuid("form_comment_id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.formId, { onDelete: "cascade" }),
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
}, (formComments) => [
  index("form_comment_form_id_idx").on(formComments.formId),
]);
