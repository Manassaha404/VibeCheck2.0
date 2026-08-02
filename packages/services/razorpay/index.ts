import db, { and, count, eq, ilike, sql } from "@repo/database";
import {
  createCheckOutDto,
  getAllPlansDto,
  applyCouponDto,
  updateSubscriptionPlanDto,
  type ApplyCouponType,
  type CreateCheckOutType,
  type GetAllPlansType,
  type UpdateSubscriptionPlanType,
} from "./model";

import {
  couponRedemptions,
  coupons,
  plans,
  subscriptions,
  razorpayWebhookEvents,
} from "@repo/database/models";
import { AppError } from "@repo/error";
import razorpayInstance from "./client";
import { env } from "../env";
const ACTIVE_STATUSES = ["active", "authenticated"] as const;
class SubscriptionService {
  //validate coupon code
  private async validateCoupon(
    couponCode: string,
    userId: string,
    planId: string,
  ) {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, couponCode));
    if (!coupon) {
      throw new AppError("BAD_REQUEST", "Invalid coupon code");
    }
    if (!coupon.isActive) {
      throw new AppError("BAD_REQUEST", "This coupon is no longer active");
    }
    const now = new Date();
    if (coupon.validFrom > now) {
      throw new AppError("BAD_REQUEST", "This coupon isn't active yet");
    }
    if (coupon.validUntil && coupon.validUntil < now) {
      throw new AppError("BAD_REQUEST", "This coupon has expired");
    }
    if (coupon.applicablePlanId && coupon.applicablePlanId !== planId) {
      throw new AppError(
        "BAD_REQUEST",
        "This coupon isn't valid for the selected plan",
      );
    }
    if (
      coupon.maxRedemptions !== null &&
      coupon.timesRedeemed >= coupon.maxRedemptions
    ) {
      throw new AppError(
        "BAD_REQUEST",
        "This coupon has reached its redemption limit",
      );
    }

    const [userRedemptions] = await db
      .select({ c: count() })
      .from(couponRedemptions)
      .where(
        and(
          eq(couponRedemptions.couponId, coupon.couponId),
          eq(couponRedemptions.userId, userId),
        ),
      );

    if (userRedemptions && userRedemptions.c >= coupon.maxRedemptionsPerUser) {
      throw new AppError("BAD_REQUEST", "You've already used this coupon");
    }
    if (!coupon.razorpayOfferId) {
      throw new AppError(
        "BAD_REQUEST",
        "This coupon isn't properly configured. Please contact support.",
      );
    }
    return coupon;
  }
  // calculate the discounted price based on the coupon type and value
  private applyDiscount(
    priceInPaise: number,
    coupon: { discountType: "percentage" | "flat"; discountValue: number },
  ): number {
    if (coupon.discountType === "percentage") {
      return Math.round(priceInPaise * (1 - coupon.discountValue / 100));
    }
    return Math.max(0, priceInPaise - coupon.discountValue);
  }

  //create razorpay subscription
  private async createRazorpaySubscription(params: {
    razorpayPlanId: string;
    offerId?: string | null; // from coupon.razorpayOfferId, if applied
    totalCount?: number;
    notes?: Record<string, string>;
  }) {
    try {
      return await razorpayInstance.subscriptions.create({
        plan_id: params.razorpayPlanId,
        ...(params.offerId ? { offer_id: params.offerId } : {}),
        customer_notify: 1,
        total_count: params.totalCount ?? 120,
        notes: params.notes,
      });
    } catch (err: any) {
      const errorMessage =
        err?.error?.description ||
        err?.message ||
        "Failed to create Razorpay subscription";
      throw new AppError("BAD_REQUEST", `Razorpay Error: ${errorMessage}`);
    }
  }

  // apply a coupon to a plan for a user, returning the discounted price and coupon details
  public async applyCoupon(userId: string, payload: ApplyCouponType) {
    const { couponCode, planId } = applyCouponDto.parse(payload);
    const coupon = await this.validateCoupon(couponCode, userId, planId);
    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.planId, planId));
    if (!plan) throw new AppError("BAD_REQUEST", "Invalid plan");
    const discountedPriceInPaise = this.applyDiscount(plan.priceInPaise, {
      discountType: coupon.discountType as "percentage" | "flat",
      discountValue: coupon.discountValue,
    });
    return {
      valid: true,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      originalPriceInPaise: plan.priceInPaise,
      discountedPriceInPaise,
      couponId: coupon.couponId,
    };
  }

  // create checkout for razorpay subscription
  public async createCheckOut(
    payload: CreateCheckOutType,
    oldSubscriptionIdToCancel?: string,
  ) {
    const { couponCode, planId, userId } =
      await createCheckOutDto.parseAsync(payload);
    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.planId, planId));
    if (!plan || !plan.razorpayPlanId) {
      throw new AppError("BAD_REQUEST", "Invalid or non-purchasable plan");
    }
    let offerId: string | null = null;
    let couponId: string | null = null;
    try {
      if (couponCode) {
        const coupon = await this.validateCoupon(couponCode, userId, planId);
        offerId = coupon.razorpayOfferId;
        couponId = coupon.couponId;
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "unexpected error occur when validate the coupon",
      );
    }
    const rzpSub = await this.createRazorpaySubscription({
      razorpayPlanId: plan.razorpayPlanId as string,
      offerId,
      notes: {
        userId,
        planId: plan.planId,
        ...(oldSubscriptionIdToCancel
          ? { cancelOldSub: oldSubscriptionIdToCancel }
          : {}),
      },
    });
    const [inserted] = await db
      .insert(subscriptions)
      .values({
        userId,
        planId: plan.planId,
        razorpaySubscriptionId: rzpSub.id,
        status: "created",
        couponId: couponId ? couponId : null,
      })
      .returning();
    return {
      subscriptionId: rzpSub.id, // Razorpay's ID, for Checkout.js
      localSubscriptionId: inserted?.subscriptionId, // your own uuid, if needed
      keyId: env.RAZORPAY_KEY_ID,
    };
  }

  // cancel subscription
  public async cancelSubscription(
    userId: string,
    razorpaySubscriptionId: string,
    cancelAtCycleEnd = true,
  ) {
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.razorpaySubscriptionId, razorpaySubscriptionId));

    if (!sub) {
      throw new AppError("NOT_FOUND", "Subscription not found");
    }
    if (sub.userId !== userId) {
      throw new AppError("FORBIDDEN", "Access denied");
    }
    if (sub.status === "cancelled" || sub.status === "completed") {
      throw new AppError(
        "BAD_REQUEST",
        "Subscription is already cancelled or completed",
      );
    }

    const razorpayResponse = await razorpayInstance.subscriptions.cancel(
      razorpaySubscriptionId,
      cancelAtCycleEnd ? 1 : 0,
    );

    await db
      .update(subscriptions)
      .set({
        status: cancelAtCycleEnd ? "active" : "cancelled",
        cancelAtCycleEnd,
        scheduledCancellationDate:
          cancelAtCycleEnd && razorpayResponse.current_end
            ? new Date(razorpayResponse.current_end * 1000)
            : (sub.currentEnd ?? null),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.razorpaySubscriptionId, razorpaySubscriptionId));
    return { success: true };
  }

  //update subscription plan for a user, handling Razorpay API and DB updates
  public async updateSubscriptionPlan(
    userId: string,
    payload: UpdateSubscriptionPlanType,
  ) {
    const data = updateSubscriptionPlanDto.parse(payload);
    const interval = data.interval ?? "monthly";

    //Find target plan in DB
    const [targetPlan] = await db
      .select()
      .from(plans)
      .where(and(eq(plans.planId, data.planId), eq(plans.interval, interval)));

    if (!targetPlan) {
      throw new AppError("NOT_FOUND", "Target plan not found in system");
    }

    //Validate coupon if provided
    let offerId: string | null = null;
    let couponId: string | null = null;
    if (data.couponCode) {
      const coupon = await this.validateCoupon(
        data.couponCode,
        userId,
        targetPlan.planId,
      );
      offerId = coupon.razorpayOfferId;
      couponId = coupon.couponId;
    }

    //Get user's active subscription
    const activeSubData = await this.getActiveSubscription(userId);
    const existingSub = activeSubData.subscription;

    if (
      activeSubData.plan.planId === targetPlan.planId &&
      ACTIVE_STATUSES.includes(existingSub?.status as any)
    ) {
      throw new AppError(
        "BAD_REQUEST",
        "You are already subscribed to this plan",
      );
    }

    //If user has an active Razorpay subscription, update it via Razorpay API
    if (
      existingSub?.razorpaySubscriptionId &&
      ACTIVE_STATUSES.includes(existingSub.status as any)
    ) {
      let scheduledFor: "now" | "cycle_end";

      const tryUpdate = async (schedule: "now" | "cycle_end") => {
        return razorpayInstance.subscriptions.update(
          existingSub.razorpaySubscriptionId
            ? existingSub.razorpaySubscriptionId
            : "",
          {
            plan_id: targetPlan.razorpayPlanId as string,
            ...(offerId ? { offer_id: offerId } : {}),
            schedule_change_at: schedule,
            customer_notify: 1,
          },
        );
      };

      const goToCheckout = async () => {
        const checkoutResult = await this.createCheckOut(
          {
            planId: targetPlan.planId,
            userId,
            couponCode: data.couponCode ?? null,
          },
          existingSub.razorpaySubscriptionId
            ? existingSub.razorpaySubscriptionId
            : "",
        );
        return {
          action: "checkout_required" as const,
          ...checkoutResult,
          plan: targetPlan,
        };
      };

      try {
        await tryUpdate("now");
        scheduledFor = "now";
      } catch (err: any) {
        const errStr = (
          err?.error?.description ||
          err?.message ||
          ""
        ).toLowerCase();

        if (errStr.includes("domestic card")) {
          return await goToCheckout();
        }

        const isMandateError = errStr.includes("card mandate is applicable");
        if (!isMandateError) {
          throw new AppError(
            "BAD_REQUEST",
            `Razorpay Error: ${err?.error?.description || err?.message || "Failed to update Razorpay subscription"}`,
          );
        }

        try {
          await tryUpdate("cycle_end");
          scheduledFor = "cycle_end";
        } catch (fallbackErr: any) {
          const fallbackErrStr = (
            fallbackErr?.error?.description ||
            fallbackErr?.message ||
            ""
          ).toLowerCase();

          if (fallbackErrStr.includes("domestic card")) {
            return await goToCheckout();
          }

          throw new AppError(
            "BAD_REQUEST",
            `Razorpay Error: ${fallbackErr?.error?.description || fallbackErr?.message || "Failed to update Razorpay subscription"}`,
          );
        }
      }

      // Razorpay succeeded — DB must match, retry on failure
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          if (scheduledFor === "now") {
            await db
              .update(subscriptions)
              .set({
                planId: targetPlan.planId,
                couponId: couponId ?? null,
                pendingPlanId: null,
                pendingCouponId: null,
                updatedAt: new Date(),
              })
              .where(
                eq(
                  subscriptions.razorpaySubscriptionId,
                  existingSub.razorpaySubscriptionId,
                ),
              );
          } else {
            await db
              .update(subscriptions)
              .set({
                pendingPlanId: targetPlan.planId,
                pendingCouponId: couponId ?? null, // FIX: null instead of undefined
                updatedAt: new Date(),
              })
              .where(
                eq(
                  subscriptions.razorpaySubscriptionId,
                  existingSub.razorpaySubscriptionId,
                ),
              );
          }
          break;
        } catch (dbErr) {
          if (attempt === 3) {
            console.error(
              "CRITICAL: subscription updated on Razorpay but DB write failed",
              {
                userId,
                razorpaySubscriptionId: existingSub.razorpaySubscriptionId,
                newPlanId: targetPlan.planId,
                error: dbErr,
              },
            );
            throw new AppError(
              "INTERNAL_SERVER_ERROR",
              "Your plan was updated but we couldn't sync it. Our team has been notified.",
            );
          }
          await new Promise((res) => setTimeout(res, 500 * attempt));
        }
      }

      return {
        action: "updated" as const,
        subscriptionId: existingSub.razorpaySubscriptionId,
        plan: targetPlan,
        scheduledFor,
      };
    }

    // 5. No active Razorpay subscription → create checkout
    const checkoutResult = await this.createCheckOut({
      planId: targetPlan.planId,
      userId,
      couponCode: data.couponCode ?? null,
    });

    return {
      action: "checkout_required" as const,
      ...checkoutResult,
      plan: targetPlan,
    };
  }

  //------------webhook service to handle razorpay webhook events------------

  // check if webhook event has already been processed
  public async checkWebHookAlreadyProcessed(eventId: string) {
    const [alreadyProcessed] = await db
      .select()
      .from(razorpayWebhookEvents)
      .where(eq(razorpayWebhookEvents.id, eventId));
    if (alreadyProcessed) {
      return true;
    } else {
      return false;
    }
  }

  public async handleSubscriptionEvent(event: string, sub: any) {
    switch (event) {
      case "subscription.authenticated": {
        await db
          .update(subscriptions)
          .set({ status: "authenticated", updatedAt: new Date() })
          .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
        break;
      }
      case "subscription.activated": {
        const [updated] = await db
          .update(subscriptions)
          .set({
            status: "active",
            currentStart: sub.current_start
              ? new Date(sub.current_start * 1000)
              : null,
            currentEnd: sub.current_end
              ? new Date(sub.current_end * 1000)
              : null,
            chargeAt: sub.charge_at ? new Date(sub.charge_at * 1000) : null,
            totalCount: sub.total_count,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.razorpaySubscriptionId, sub.id))
          .returning();
        if (updated?.couponId) {
          const [alreadyRedeemed] = await db
            .select()
            .from(couponRedemptions)
            .where(
              eq(couponRedemptions.subscriptionId, updated.subscriptionId),
            );
          if (!alreadyRedeemed) {
            await db.insert(couponRedemptions).values({
              couponId: updated.couponId,
              userId: updated.userId,
              subscriptionId: updated.subscriptionId,
            });
            await db
              .update(coupons)
              .set({ timesRedeemed: sql`${coupons.timesRedeemed} + 1` })
              .where(eq(coupons.couponId, updated.couponId));
          }
        }

        if (sub.notes?.cancelOldSub && updated) {
          try {
            await razorpayInstance.subscriptions.cancel(
              sub.notes.cancelOldSub,
              0,
            );
            await db
              .update(subscriptions)
              .set({ status: "cancelled", updatedAt: new Date() })
              .where(
                eq(
                  subscriptions.razorpaySubscriptionId,
                  sub.notes.cancelOldSub,
                ),
              );
          } catch (e) {
            console.error(
              "Failed to cancel old sub during domestic card upgrade",
              e,
            );
          }
        }
        break;
      }
      case "subscription.updated": {
        const [targetPlan] = await db
          .select()
          .from(plans)
          .where(eq(plans.razorpayPlanId, sub.plan_id));

        if (targetPlan) {
          await db
            .update(subscriptions)
            .set({
              planId: targetPlan.planId,
              pendingPlanId: null,
              pendingCouponId: null,
              status: sub.status,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
        }
        break;
      }
      case "subscription.charged": {
        await db
          .update(subscriptions)
          .set({
            status: "active",
            currentStart: new Date(sub.current_start * 1000),
            currentEnd: new Date(sub.current_end * 1000),
            paidCount: sub.paid_count,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
        break;
      }
      case "subscription.pending": {
        await db
          .update(subscriptions)
          .set({ status: "pending", updatedAt: new Date() })
          .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
        break;
      }
      case "subscription.halted": {
        await db
          .update(subscriptions)
          .set({ status: "halted", updatedAt: new Date() })
          .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
        break;
      }
      case "subscription.cancelled": {
        await db
          .update(subscriptions)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
        break;
      }
      case "subscription.completed": {
        await db
          .update(subscriptions)
          .set({ status: "completed", updatedAt: new Date() })
          .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
        break;
      }
      case "subscription.failed": {
        await db
          .update(subscriptions)
          .set({ status: "failed", updatedAt: new Date() })
          .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
        break;
      }
      case "subscription.expired": {
        await db
          .update(subscriptions)
          .set({ status: "expired", updatedAt: new Date() })
          .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
        break;
      }
      default:
        break;
    }
  }

  public async insertWebhookEvents(eventId: string, eventType: string) {
    await db.insert(razorpayWebhookEvents).values({ id: eventId, eventType });
  }

  // --------some utility functions to get subscription and plan details for a user-----------
  // get the status of a subscription for a user
  public async getPaymentStatus(
    razorpaySubscriptionId: string,
    userId: string,
  ) {
    const [sub] = await db
      .select({
        status: subscriptions.status,
        subscriptionId: subscriptions.subscriptionId,
        userId: subscriptions.userId,
      })
      .from(subscriptions)
      .where(eq(subscriptions.razorpaySubscriptionId, razorpaySubscriptionId));

    if (!sub) {
      throw new AppError("NOT_FOUND", "Subscription not found");
    }
    if (sub.userId !== userId) {
      throw new AppError("FORBIDDEN", "Access denied");
    }
    return { status: sub.status, subscriptionId: sub.subscriptionId };
  }

  // get the current plan for a user, or the free plan if none
  public async getUserPlan(userId: string) {
    // Bug #5 fix: order DESC so the newest subscription is picked, not the oldest
    const subs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(sql`${subscriptions.createdAt} DESC`);
    const latestSub = subs[0];
    if (latestSub && ACTIVE_STATUSES.includes(latestSub.status as any)) {
      const [plan] = await db
        .select()
        .from(plans)
        .where(eq(plans.planId, latestSub.planId));
      if (plan) return plan;
    }
    const [freePlan] = await db
      .select()
      .from(plans)
      .where(eq(plans.name, "Free"));
    if (!freePlan) {
      throw new Error("Free plan not found — check your plans table seed data");
    }
    return freePlan;
  }

  // get the active subscription for a user, or null if none
  public async getActiveSubscription(userId: string) {
    const subs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(sql`${subscriptions.createdAt} DESC`);

    const latestSub = subs[0] ?? null;

    let plan;
    if (latestSub) {
      const [p] = await db
        .select()
        .from(plans)
        .where(eq(plans.planId, latestSub.planId));
      plan = p;
    }
    if (!plan) {
      const [freePlan] = await db
        .select()
        .from(plans)
        .where(eq(plans.name, "Free"));
      if (!freePlan) {
        throw new Error(
          "Free plan not found — check your plans table seed data",
        );
      }
      plan = freePlan;
    }

    return {
      plan,
      subscription: latestSub
        ? {
            razorpaySubscriptionId: latestSub.razorpaySubscriptionId,
            status: latestSub.status,
            cancelAtCycleEnd: latestSub.cancelAtCycleEnd,
            scheduledCancellationDate: latestSub.scheduledCancellationDate,
            currentEnd: latestSub.currentEnd,
            currentStart: latestSub.currentStart,
            paidCount: latestSub.paidCount,
            pendingPlanId: latestSub.pendingPlanId,
          }
        : null,
    };
  }

  // get all plans, optionally filtered by interval (monthly/yearly)
  public async getAllPlans(payload?: GetAllPlansType) {
    const data = getAllPlansDto.parse(payload ?? {});
    let query = db.select().from(plans).$dynamic();
    if (data.interval) {
      query = query.where(eq(plans.interval, data.interval));
    }
    const allPlans = await query;
    return allPlans;
  }
}
export default SubscriptionService;
