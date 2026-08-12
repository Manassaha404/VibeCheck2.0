import { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const plans = pgTable("plans", {
  planId: uuid("plan_id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  razorpayPlanId: text("razorpay_plan_id"), // null for free plan
  priceInPaise: integer("price_in_paise").notNull().default(0),
  interval: text("interval")
    .notNull()
    .default("monthly")
    .$type<"monthly" | "yearly">(), // monthly | yearly
  maxQuizzes: integer("max_quizzes").notNull().default(3),
  maxQuestionsPerQuiz: integer("max_questions_per_quiz").notNull().default(10),
  maxSessionsPerQuiz: integer("max_sessions_per_quiz").notNull().default(2),
  maxForms: integer("max_forms").notNull().default(10),
  aiFeaturesForQuizEnabled: boolean("ai_features_for_quiz_enabled")
    .notNull()
    .default(false),
  aiFeaturesForFormsEnabled: boolean("ai_features_for_forms_enabled")
    .notNull()
    .default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Plan = InferSelectModel<typeof plans>;
