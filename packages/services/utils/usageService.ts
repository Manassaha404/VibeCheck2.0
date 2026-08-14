import db, { eq, and } from "@repo/database";
import { usageCounters } from "@repo/database/models/payment&subscription/usages";
import { subscriptions } from "@repo/database/models/payment&subscription/subscriptions";
import { plans } from "@repo/database/models/payment&subscription/plans";
import { AppError } from "@repo/error";
import type { Plan } from "@repo/database/models/payment&subscription/plans";

export type UsageMetric =
  | "quiz_created"
  | "form_created"
  | "quiz_session_created"
  | "ai_call_quiz"
  | "ai_call_form";

const ACTIVE_SUB_STATUSES = ["active", "authenticated"] as const;

function getLimitForMetric(metric: UsageMetric, plan: Plan): number {
  switch (metric) {
    case "quiz_created":
      return plan.maxQuizzes;
    case "form_created":
      return plan.maxForms;
    case "quiz_session_created":
      return plan.maxSessionsPerQuiz;
    case "ai_call_quiz":
      // Boolean → 0 means disabled, Infinity means unlimited
      return plan.aiFeaturesForQuizEnabled ? Infinity : 0;
    case "ai_call_form":
      return plan.aiFeaturesForFormsEnabled ? Infinity : 0;
  }
}

function friendlyMetricName(metric: UsageMetric): string {
  switch (metric) {
    case "quiz_created":
      return "quiz";
    case "form_created":
      return "form";
    case "quiz_session_created":
      return "quiz session";
    case "ai_call_quiz":
      return "AI feature for quizzes";
    case "ai_call_form":
      return "AI feature for forms";
  }
}

function endOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0),
  );
}

async function resolveUserPlan(userId: string): Promise<Plan> {
  const allSubs = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(subscriptions.createdAt);
  const activeSub = allSubs.find((s) =>
    ACTIVE_SUB_STATUSES.includes(
      s.status as (typeof ACTIVE_SUB_STATUSES)[number],
    ),
  );
  if (activeSub) {
    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.planId, activeSub.planId));
    if (plan) return plan;
  }

  // Free-plan fallback
  const [freePlan] = await db
    .select()
    .from(plans)
    .where(eq(plans.name, "Free"));
  if (!freePlan) {
    throw new Error("Free plan not found — check plans table seed data");
  }
  return freePlan;
}

async function resolvePeriodEnd(userId: string): Promise<Date> {
  const activeSub = await db
    .select({
      currentEnd: subscriptions.currentEnd,
      status: subscriptions.status,
    })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(subscriptions.createdAt)
    .then((rows) =>
      rows.find((s) =>
        ACTIVE_SUB_STATUSES.includes(
          s.status as (typeof ACTIVE_SUB_STATUSES)[number],
        ),
      ),
    );

  if (activeSub?.currentEnd) return activeSub.currentEnd;

  return endOfCurrentMonth();
}

class UsageService {
  public async assertWithinLimit(
    userId: string,
    metric: UsageMetric,
  ): Promise<{ periodEnd: Date; plan: Plan }> {
    const [plan, periodEnd] = await Promise.all([
      resolveUserPlan(userId),
      resolvePeriodEnd(userId),
    ]);

    const limit = getLimitForMetric(metric, plan);

    // Feature completely disabled on this plan (e.g. AI on Free)
    if (limit === 0) {
      throw new AppError(
        "FORBIDDEN",
        `Your current plan does not include ${friendlyMetricName(metric)}s. Please upgrade to continue.`,
      );
    }

    // Unlimited on this plan — skip counter check
    if (limit === -1) {
      return { periodEnd, plan };
    }

    const now = new Date();

    // Fetch the stored counter
    const [counter] = await db
      .select()
      .from(usageCounters)
      .where(
        and(eq(usageCounters.userId, userId), eq(usageCounters.metric, metric)),
      );
    const isStale = counter ? counter.periodEnd < now : false;
    const effectiveCount = !counter || isStale ? 0 : counter.count;

    if (effectiveCount >= limit) {
      throw new AppError(
        "FORBIDDEN",
        `You have reached the ${friendlyMetricName(metric)} limit (${limit}) on your current plan. Please upgrade to create more.`,
      );
    }

    return { periodEnd, plan };
  }

  public async incrementUsage(
    userId: string,
    metric: UsageMetric,
    periodEnd: Date,
  ): Promise<void> {
    const now = new Date();

    const [existing] = await db
      .select()
      .from(usageCounters)
      .where(
        and(eq(usageCounters.userId, userId), eq(usageCounters.metric, metric)),
      );

    if (!existing) {
      await db.insert(usageCounters).values({
        userId,
        metric,
        count: 1,
        periodEnd,
        updatedAt: now,
      });
      return;
    }

    const isStale = existing.periodEnd < now;

    await db
      .update(usageCounters)
      .set({
        // Stale period → reset; current period → increment
        count: isStale ? 1 : existing.count + 1,
        // Always push the latest known periodEnd (subscription might have renewed)
        periodEnd,
        updatedAt: now,
      })
      .where(
        and(eq(usageCounters.userId, userId), eq(usageCounters.metric, metric)),
      );
  }
}

export const usageService = new UsageService();
export default UsageService;
