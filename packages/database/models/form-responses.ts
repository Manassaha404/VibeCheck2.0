import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { forms } from "./forms";
import { users } from "./users";

export const formResponses = pgTable(
  "form_responses",
  {
    responseId: uuid("response_id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .notNull()
      .references(() => forms.formId, { onDelete: "cascade" }),
    guestToken: uuid("guest_token"),
    userId: uuid("user_id").references(() => users.userId, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (formResponses) => [
    index("form_response_form_id_idx").on(formResponses.formId),
    index("form_response_user_id_idx").on(formResponses.userId),
    index("form_response_guest_token_idx").on(formResponses.guestToken),
  ],
);
