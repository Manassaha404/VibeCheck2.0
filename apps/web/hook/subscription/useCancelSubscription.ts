"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";

export const useCancelSubscription = () => {
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { mutateAsync, isPending } =
    trpc.subscription.cancelSubscription.useMutation({
      onError: (err) => setError(err.message),
      onSuccess: () => {
        utils.subscription.getActiveSubscription.invalidate();
      },
    });

  const cancelSubscription = async (razorpaySubscriptionId: string) => {
    setError(null);
    try {
      const result = await mutateAsync({ razorpaySubscriptionId });
      return result;
    } catch {
      return null;
    }
  };

  return { cancelSubscription, isPending, error, setError };
};
