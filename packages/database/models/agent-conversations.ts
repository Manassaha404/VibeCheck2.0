import {
  pgTable,
  uuid,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { forms } from "./forms";

export const formBuilderAgentConversation = pgTable(
  "form_building_agent_conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.userId, { onDelete: "cascade" }),
    formId: uuid("form_id")
      .notNull()
      .references(() => forms.formId, { onDelete: "cascade" }),
    // Stores AgentInputItem[] — the full conversation history consumed by @openai/agents
    history: jsonb("history").notNull().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // One conversation thread per user per form draft
    uniqueIndex("agent_conv_user_form_idx").on(t.userId, t.formId),
    index("agent_conv_user_idx").on(t.userId),
  ],
);