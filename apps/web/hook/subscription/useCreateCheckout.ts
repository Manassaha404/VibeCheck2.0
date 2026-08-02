"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/trpc/client";
import { useGetPlans } from "@/hook/subscription/useGetPlans";
import { useApplyCoupon } from "@/hook/subscription/useApplyCoupon";
import {
  usePaymentStatusPoller,
  type PaymentPollingStatus,
} from "@/hook/subscription/usePaymentStatusPoller";
import { useUserInfoStore } from "@/store/userInfoStore";

export const useCreateCheckout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId") ?? "";

  const { fullName, email } = useUserInfoStore();
  const { plans, isLoading: plansLoading } = useGetPlans("monthly");

  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: createCheckoutMutation, isPending: isCreating } =
    trpc.subscription.createCheckout.useMutation({
      onError: (err) => setError(err.message),
    });

  const {
    applyCoupon,
    clearCoupon,
    result: couponResult,
    error: couponError,
    isPending: isCouponLoading,
  } = useApplyCoupon();

  const [couponInput, setCouponInput] = useState<string | null>(null);

  const [pollingSubscriptionId, setPollingSubscriptionId] = useState<
    string | null
  >(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [resolvedStatus, setResolvedStatus] =
    useState<PaymentPollingStatus>("idle");
  const rzpScriptLoaded = useRef(false);
  const rzpScriptReady = useRef(false);
  const plan = plans.find((p) => p.planId === planId) ?? null;

  // Inject Razorpay Checkout.js script once
  useEffect(() => {
    if (rzpScriptLoaded.current) return;
    rzpScriptLoaded.current = true;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      rzpScriptReady.current = true;
    };
    document.body.appendChild(script);
  }, []);

  // Redirect to pricing if no valid planId
  useEffect(() => {
    if (!plansLoading && plans.length > 0 && !plan) {
      router.replace("/pricing");
    }
  }, [plansLoading, plans, plan, router]);

  const handlePollingResolved = useCallback((status: PaymentPollingStatus) => {
    setResolvedStatus(status);
  }, []);

  usePaymentStatusPoller({
    razorpaySubscriptionId: pollingSubscriptionId,
    onResolved: handlePollingResolved,
  });

  const overlayStatus: PaymentPollingStatus =
    resolvedStatus !== "idle" ? resolvedStatus : "polling";

  const handleSuccessRedirect = useCallback(() => {
    router.replace("/dashboard?upgrade=success");
  }, [router]);

  const handleRetry = useCallback(() => {
    setShowOverlay(false);
    setPollingSubscriptionId(null);
    setResolvedStatus("idle");
  }, []);

  const handleApplyCoupon = useCallback(
    async (code: string, pid: string) => {
      setCouponInput(code);
      return applyCoupon(code, pid);
    },
    [applyCoupon],
  );

  const handleClearCoupon = useCallback(() => {
    setCouponInput(null);
    clearCoupon();
  }, [clearCoupon]);

  const handlePay = useCallback(async () => {
    if (!plan) return;
    setError(null);

    if (
      !rzpScriptReady.current ||
      typeof (window as any).Razorpay === "undefined"
    ) {
      setError(
        "Payment gateway is still loading. Please try again in a moment.",
      );
      return;
    }

    try {
      const checkoutData = await createCheckoutMutation({
        planId: plan.planId,
        couponCode: couponResult ? (couponInput ?? null) : null,
      });

      if (!checkoutData?.subscriptionId || !checkoutData?.keyId) return;

      const options = {
        key: checkoutData.keyId,
        subscription_id: checkoutData.subscriptionId,
        name: "VibeCheck",
        description: `${plan.name} Plan — Monthly`,
        prefill: {
          name: fullName ?? "",
          email: email ?? "",
        },
        theme: { color: "#2C2E2A" },
        handler: (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          console.log("[Razorpay] payment success", response);
          setPollingSubscriptionId(checkoutData.subscriptionId);
          setResolvedStatus("idle");
          setShowOverlay(true);
        },
        modal: {
          ondismiss: () => {
            // User closed the modal without paying
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        console.error("[Razorpay] payment.failed", response.error);
        setResolvedStatus("failed");
        setShowOverlay(true);
      });

      rzp.open();
    } catch {
      // Error handled by mutation onError
    }
  }, [
    plan,
    createCheckoutMutation,
    couponResult,
    couponInput,
    fullName,
    email,
    setError,
  ]);

  return {
    router,
    plan,
    plansLoading,
    isCreating,
    checkoutError: error,
    couponResult,
    couponError,
    isCouponLoading,
    handleApplyCoupon,
    handleClearCoupon,
    handlePay,
    overlayStatus,
    handleSuccessRedirect,
    handleRetry,
    showOverlay,
  };
};
