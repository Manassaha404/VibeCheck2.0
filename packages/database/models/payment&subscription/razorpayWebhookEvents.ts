import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const razorpayWebhookEvents = pgTable("razorpay_webhook_events", {
  id: text("id").primaryKey(), // razorpay event id (x-razorpay-event-id or payload id)
  eventType: text("event_type").notNull(),
  processedAt: timestamp("processed_at").defaultNow(),
});
