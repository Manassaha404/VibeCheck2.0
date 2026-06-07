import {
  pgTable,
  uuid,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { forms } from "./forms";
import { petitions } from "./petitions";
import { polls } from "./polls";

export const saves = pgTable(
  "saves",
  {
    saveId: uuid("save_id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.userId, { onDelete: "cascade" }),
    formId: uuid("form_id").references(() => forms.formId, {
      onDelete: "cascade",
    }),
    petitionId: uuid("petition_id").references(() => petitions.petitionId, {
      onDelete: "cascade",
    }),
    pollId: uuid("poll_id").references(() => polls.pollId, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (saves) => [
    index("save_user_id_idx").on(saves.userId),
    uniqueIndex("save_user_form_idx").on(saves.userId, saves.formId),
    uniqueIndex("save_user_petition_idx").on(saves.userId, saves.petitionId),
    uniqueIndex("save_user_poll_idx").on(saves.userId, saves.pollId),
  ],
);
