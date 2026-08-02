"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";

export interface CouponResult {
  valid: boolean;
  discountType: string;
  discountValue: number;
  originalPriceInPaise: number;
  discountedPriceInPaise: number;
  couponId: string;
}

export const useApplyCoupon = () => {
  const [result, setResult] = useState<CouponResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isPending } = trpc.subscription.applyCoupon.useMutation({
    onError: (err) => {
      setError(err.message);
      setResult(null);
    },
  });

  const applyCoupon = async (couponCode: string, planId: string) => {
    setError(null);
    setResult(null);
    try {
      const data = await mutateAsync({ couponCode, planId });
      if (data) setResult(data as CouponResult);
      return data;
    } catch {
      return null;
    }
  };

  const clearCoupon = () => {
    setResult(null);
    setError(null);
  };

  return { applyCoupon, clearCoupon, result, error, isPending };
};
