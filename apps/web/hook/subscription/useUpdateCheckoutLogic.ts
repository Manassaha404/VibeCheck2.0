import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/trpc/client";
import { useGetPlans } from "@/hook/subscription/useGetPlans";
import { useUpdateSubscription } from "@/hook/subscription/useUpdateSubscription";
import { useApplyCoupon } from "@/hook/subscription/useApplyCoupon";
import { useUserInfoStore } from "@/store/userInfoStore";
import { useUpdateCheckoutStore } from "@/store/updateCheckoutStore";
import {
  usePaymentStatusPoller,
  type PaymentPollingStatus,
} from "@/hook/subscription/usePaymentStatusPoller";

export function useUpdateCheckoutLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetPlanId = searchParams.get("planId") ?? "";

  const { fullName, email } = useUserInfoStore();
  const { couponInput, setCouponInput, setUpgradeStatus, setShowOverlay } =
    useUpdateCheckoutStore();

  const { data: subData, isLoading: subLoading } =
    trpc.subscription.getActiveSubscription.useQuery();
  const { plans, isLoading: plansLoading } = useGetPlans(
    subData?.plan?.interval as "monthly" | "yearly" | undefined,
  );
  const {
    updateSubscriptionPlan,
    isPending: isUpdating,
    error: updateError,
    setError,
  } = useUpdateSubscription();
  const {
    applyCoupon,
    clearCoupon,
    result: couponResult,
    error: couponError,
    isPending: isCouponLoading,
  } = useApplyCoupon();

  const targetPlan = plans.find((p) => p.planId === targetPlanId) ?? null;

  const rzpScriptLoaded = useRef(false);
  const rzpScriptReady = useRef(false);

  // For the checkout_required path (domestic card upgrade), we poll payment status
  const [pollingSubscriptionId, setPollingSubscriptionId] = useState<string | null>(null);

  const handlePollingResolved = useCallback(
    (status: PaymentPollingStatus) => {
      if (status === "active" || status === "authenticated") {
        setUpgradeStatus("success");
        setShowOverlay(true);
      } else if (status === "failed" || status === "timeout") {
        setUpgradeStatus("error");
        setShowOverlay(false);
      }
    },
    [setUpgradeStatus, setShowOverlay],
  );

  usePaymentStatusPoller({
    razorpaySubscriptionId: pollingSubscriptionId,
    onResolved: handlePollingResolved,
  });

  // Inject Razorpay script once
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

  const handleApplyCoupon = useCallback(
    async (code: string, pid: string) => {
      setCouponInput(code);
      return applyCoupon(code, pid);
    },
    [applyCoupon, setCouponInput],
  );

  const handleClearCoupon = useCallback(() => {
    setCouponInput(null);
    clearCoupon();
  }, [clearCoupon, setCouponInput]);

  const handleSuccessRedirect = useCallback(() => {
    router.replace("/profile");
  }, [router]);

  const handleRetry = useCallback(() => {
    setShowOverlay(false);
    setUpgradeStatus("idle");
    setPollingSubscriptionId(null);
  }, [setShowOverlay, setUpgradeStatus]);

  const handleUpgrade = useCallback(async () => {
    if (isUpdating) return;
    setError(null);

    setUpgradeStatus("loading");
    setShowOverlay(true);

    if (!targetPlanId) {
      setError("No target plan specified.");
      setUpgradeStatus("error");
      setShowOverlay(false);
      return;
    }

    const res = await updateSubscriptionPlan({
      planId: targetPlanId,
      couponCode: couponResult ? (couponInput ?? null) : null,
    });

    if (!res) {
      // error is already set in the hook
      setUpgradeStatus("error");
      setShowOverlay(false);
      return;
    }

    if (res.action === "updated") {
      // Direct Razorpay plan swap — no payment flow needed
      setUpgradeStatus("success");
      return;
    }

    // checkout_required — launch Razorpay modal
    if (res.action === "checkout_required") {
      setShowOverlay(false);
      setUpgradeStatus("idle");

      if (
        !rzpScriptReady.current ||
        typeof (window as any).Razorpay === "undefined"
      ) {
        setError(
          "Payment gateway is still loading. Please try again in a moment.",
        );
        return;
      }

      const options = {
        key: res.keyId,
        subscription_id: res.subscriptionId,
        name: "VibeCheck",
        description: `${res.plan.name} Plan — Upgrade`,
        prefill: {
          name: fullName ?? "",
          email: email ?? "",
        },
        theme: { color: "#2C2E2A" },
        handler: () => {
          // Payment authorised — start polling for activation (same as main checkout)
          setPollingSubscriptionId(res.subscriptionId);
          setUpgradeStatus("loading");
          setShowOverlay(true);
        },
        modal: {
          ondismiss: () => {
            setUpgradeStatus("idle");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", () => {
        setUpgradeStatus("error");
        setError("Payment failed. Please try again or contact support.");
      });
      rzp.open();
    }
  }, [
    isUpdating,
    updateSubscriptionPlan,
    couponResult,
    couponInput,
    fullName,
    email,
    setError,
    targetPlanId,
    setUpgradeStatus,
    setShowOverlay,
    setPollingSubscriptionId,
  ]);

  return {
    router,
    targetPlan,
    subData,
    subLoading,
    plansLoading,
    isUpdating,
    updateError,
    couponResult,
    couponError,
    isCouponLoading,
    handleApplyCoupon,
    handleClearCoupon,
    handleSuccessRedirect,
    handleRetry,
    handleUpgrade,
    currentPlanId: subData?.plan?.planId ?? "",
  };
}
