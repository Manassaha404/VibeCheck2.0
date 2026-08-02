import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "../users";
import { plans } from "./plans";
import { coupons } from "./coupons";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "created",
  "authenticated",
  "active",
  "pending",
  "halted",
  "cancelled",
  "completed",
  "expired",
  "failed",
]);

export const subscriptions = pgTable("subscriptions", {
  subscriptionId: uuid("subscription_id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.planId),
  razorpaySubscriptionId: text("razorpay_subscription_id").unique(),
  razorpayCustomerId: text("razorpay_customer_id"),
  status: subscriptionStatusEnum("status").notNull().default("created"),
  cancelAtCycleEnd: boolean("cancel_at_cycle_end").default(false).notNull(),
  scheduledCancellationDate: timestamp("scheduled_cancellation_date"),
  couponId: uuid("coupon_id").references(() => coupons.couponId),
  pendingPlanId: uuid("pending_plan_id").references(() => plans.planId),
  pendingCouponId: uuid("pending_coupon_id").references(() => coupons.couponId),
  currentStart: timestamp("current_start"),
  currentEnd: timestamp("current_end"),
  chargeAt: timestamp("charge_at"),
  totalCount: integer("total_count"),
  paidCount: integer("paid_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
