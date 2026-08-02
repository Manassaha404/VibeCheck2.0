// db/schema/couponRedemptions.ts
import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users";
import { coupons } from "./coupons";
import { subscriptions } from "./subscriptions";

export const couponRedemptions = pgTable("coupon_redemptions", {
  redemptionId: uuid("redemption_id").primaryKey().defaultRandom(),
  couponId: uuid("coupon_id")
    .notNull()
    .references(() => coupons.couponId),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId),
  subscriptionId: uuid("subscription_id").references(
    () => subscriptions.subscriptionId,
  ),
  redeemedAt: timestamp("redeemed_at").defaultNow(),
});
