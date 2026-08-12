import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import {
  getAllPlansDto,
  createCheckOutDto,
  applyCouponDto,
  updateSubscriptionPlanDto,
} from "@repo/services/razorpay/model";
import { subscriptionService } from "../../services";
import { handleRouteError } from "../../utils/error";

export const subscriptionRouter = router({
  //public routes
  getAllPlans: publicProcedure
    .input(getAllPlansDto)
    .query(async ({ input }) => {
      try {
        const plans = await subscriptionService.getAllPlans(input);
        return { plans };
      } catch (error) {
        handleRouteError(error);
      }
    }),


  //protected routes
  createCheckout: protectedProcedure
    .input(createCheckOutDto.omit({ userId: true }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await subscriptionService.createCheckOut({
          ...input,
          userId: ctx.user.id,
        });
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),

  applyCoupon: protectedProcedure
    .input(applyCouponDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await subscriptionService.applyCoupon(
          ctx.user.id,
          input,
        );
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),

  getUserPlan: protectedProcedure.query(async ({ ctx }) => {
    try {
      const plan = await subscriptionService.getUserPlan(ctx.user.id);
      return { plan };
    } catch (error) {
      handleRouteError(error);
    }
  }),

  getPaymentStatus: protectedProcedure
    .input(z.object({ razorpaySubscriptionId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      try {
        const result = await subscriptionService.getPaymentStatus(
          input.razorpaySubscriptionId,
          ctx.user.id,
        );
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),

  getActiveSubscription: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await subscriptionService.getActiveSubscription(
        ctx.user.id,
      );
      return result;
    } catch (error) {
      handleRouteError(error);
    }
  }),

  cancelSubscription: protectedProcedure
    .input(z.object({ razorpaySubscriptionId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await subscriptionService.cancelSubscription(
          ctx.user.id,
          input.razorpaySubscriptionId,
        );
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),

  updateSubscriptionPlan: protectedProcedure
    .input(updateSubscriptionPlanDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await subscriptionService.updateSubscriptionPlan(
          ctx.user.id,
          input,
        );
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),
});
