import { pgTable, uuid, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { formFields } from "./form-fields";
import { formResponses } from "./form-responses";

export const formAnswers = pgTable("form_answers", {
  answerId: uuid("answer_id").primaryKey().defaultRandom(),
  fieldId: uuid("field_id")
    .notNull()
    .references(() => formFields.fieldId, { onDelete: "cascade" }),
  responseId: uuid("response_id")
    .notNull()
    .references(() => formResponses.responseId, { onDelete: "cascade" }),
  value: jsonb("value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (formAnswers) => [
  index("form_answer_field_id_idx").on(formAnswers.fieldId),
  index("form_answer_response_id_idx").on(formAnswers.responseId),
]);
