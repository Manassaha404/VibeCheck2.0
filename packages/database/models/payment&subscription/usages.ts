import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "../users";

export const usageMetricEnum = pgEnum("usage_metric", [
  "quiz_created", // → checked against plans.maxQuizzes
  "form_created", // → checked against plans.maxForms
  "quiz_session_created", // → checked against plans.maxSessionsPerQuiz
  "ai_call_quiz", // → checked against plans.aiFeaturesForQuizEnabled
  "ai_call_form", // → checked against plans.aiFeaturesForFormsEnabled
]);

export const usageCounters = pgTable("usage_counters", {
  usageCountersId: uuid("usage_counters_id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId),
  metric: usageMetricEnum("metric").notNull(),
  count: integer("count").notNull().default(0),
  periodEnd: timestamp("period_end").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
