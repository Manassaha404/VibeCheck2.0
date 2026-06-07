import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  jsonb,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { forms } from "./forms";

export const fieldTypeEnum = pgEnum("field_type", [
  "short_text",
  "long_text",
  "number",
  "email",
  "phone",
  "date",
  "select",
  "multi_select",
  "radio",
  "checkbox",
  "file",
  "rating",
  "scale",
]);

export const formFields = pgTable("form_fields", {
  fieldId: uuid("field_id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.formId, { onDelete: "cascade" }),
  isPrimary: boolean("is_primary").default(false).notNull(),
  orderIndex: integer("order_index").notNull(),
  type: fieldTypeEnum("type").notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  placeholder: varchar("placeholder", { length: 255 }),
  isRequired: boolean("is_required").default(false).notNull(),
  options: jsonb("options"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (formFields) => [
  index("form_field_form_id_idx").on(formFields.formId),
  index("form_field_form_id_order_idx").on(formFields.formId, formFields.orderIndex),
]);
