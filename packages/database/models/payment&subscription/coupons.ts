import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { plans } from "./plans";

export const discountTypeEnum = pgEnum("discount_type", ["percentage", "flat"]);

export const coupons = pgTable("coupons", {
  couponId: uuid("coupon_id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(),
  applicablePlanId: uuid("applicable_plan_id").references(() => plans.planId),
  razorpayOfferId: text("razorpay_offer_id"),
  maxRedemptions: integer("max_redemptions"),
  timesRedeemed: integer("times_redeemed").notNull().default(0),
  maxRedemptionsPerUser: integer("max_redemptions_per_user")
    .notNull()
    .default(1),
  validFrom: timestamp("valid_from").notNull().defaultNow(),
  validUntil: timestamp("valid_until"), //null means no expiration
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
