import { z } from "zod";

// ── Checkout ──────────────────────────────────────────────────────────────
export const createCheckOutDto = z.object({
  planId: z.string().uuid().describe("the id of plan inside database"),
  // Bug #6 fix: preprocess handles null/undefined first, then string transforms run safely.
  // Previously, .uppercase().trim() ran before .nullable() causing a crash on null input.
  couponCode: z.preprocess(
    (val) =>
      val == null || val === "" ? null : String(val).trim().toUpperCase(),
    z.string().nullable(),
  ),
  userId: z.string().uuid(),
});

export type CreateCheckOutType = z.infer<typeof createCheckOutDto>;

// ── Get All Plans ─────────────────────────────────────────────────────────
export const getAllPlansDto = z.object({
  interval: z
    .enum(["monthly", "yearly"])
    .optional()
    .describe("filter plans by billing interval"),
});

export type GetAllPlansType = z.infer<typeof getAllPlansDto>;

// ── Apply Coupon (validate only) ──────────────────────────────────────────
export const applyCouponDto = z.object({
  couponCode: z.string().min(1).uppercase().trim(),
  planId: z.string().uuid(),
});

export type ApplyCouponType = z.infer<typeof applyCouponDto>;

// ── Update Subscription Plan ───────────────────────────────────────────────────
export const updateSubscriptionPlanDto = z.object({
  planId: z.string().uuid(),
  couponCode: z.preprocess(
    (val) =>
      val == null || val === "" ? null : String(val).trim().toUpperCase(),
    z.string().nullable().optional(),
  ),
  interval: z.enum(["monthly", "yearly"]).optional().default("monthly"),
});

export type UpdateSubscriptionPlanType = z.infer<
  typeof updateSubscriptionPlanDto
>;
