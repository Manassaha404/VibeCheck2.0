"use client";

import { useEffect } from "react";
import { trpc } from "@/trpc/client";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export function SubscriptionDataProvider() {
  const { data: plansData } = trpc.subscription.getAllPlans.useQuery({}, {
    staleTime: Infinity,
  });

  const setAvailablePlans = useSubscriptionStore((s) => s.setAvailablePlans);

  useEffect(() => {
    if (plansData?.plans) {
      setAvailablePlans(
        plansData.plans.map((p: any) => ({
          ...p,
          createdAt: p.createdAt ? new Date(p.createdAt) : null,
        })),
      );
    }
  }, [plansData, setAvailablePlans]);

  return null;
}
