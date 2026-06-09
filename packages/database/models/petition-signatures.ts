import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { petitions } from "./petitions";
import { users } from "./users";

export const petitionSignatures = pgTable("petition_signatures", {
  petitionSignatureId: uuid("petition_signature_id")
    .primaryKey()
    .defaultRandom(),
  petitionId: uuid("petition_id")
    .notNull()
    .references(() => petitions.petitionId, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  userId: uuid("user_id").references(() => users.userId, {
    onDelete: "set null",
  }),
  city: varchar("city", { length: 255 }),
  country: varchar("country", { length: 255 }),
  guestToken: uuid("guest_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (petitionSignatures) => [
  index("petition_signature_petition_id_idx").on(petitionSignatures.petitionId),
  index("petition_signature_user_id_idx").on(petitionSignatures.userId),
  index("petition_signature_guest_token_idx").on(petitionSignatures.guestToken),
]);
