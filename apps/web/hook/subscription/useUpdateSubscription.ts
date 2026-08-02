"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";

export interface UpdateSubscriptionPlanParams {
  planId: string;
  couponCode?: string | null;
  interval?: "monthly" | "yearly";
}

export const useUpdateSubscription = () => {
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { mutateAsync, isPending } =
    trpc.subscription.updateSubscriptionPlan.useMutation({
      onError: (err) => setError(err.message),
      onSuccess: () => {
        utils.subscription.getActiveSubscription.invalidate();
        utils.subscription.getUserPlan.invalidate();
      },
    });

  const updateSubscriptionPlan = async (
    params: UpdateSubscriptionPlanParams,
  ) => {
    setError(null);
    try {
      const result = await mutateAsync(params);
      return result;
    } catch {
      return null;
    }
  };

  return { updateSubscriptionPlan, isPending, error, setError };
};
