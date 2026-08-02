"use client";

import { useEffect, useRef } from "react";
import { trpc } from "@/trpc/client";

const PENDING_STATUSES = new Set(["created", "pending"]);

const SUCCESS_STATUSES = new Set(["active", "authenticated"]);

export type PaymentPollingStatus =
  "idle" | "polling" | "active" | "authenticated" | "failed" | "timeout";

interface UsePaymentStatusPollerOptions {
  razorpaySubscriptionId: string | null;

  onResolved: (status: PaymentPollingStatus) => void;

  intervalMs?: number;
  timeoutMs?: number;
}

export const usePaymentStatusPoller = ({
  razorpaySubscriptionId,
  onResolved,
  intervalMs = 3000,
  timeoutMs = 120_000,
}: UsePaymentStatusPollerOptions): PaymentPollingStatus => {
  const utils = trpc.useUtils();
  const resolvedRef = useRef(false);
  const startRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingStatusRef = useRef<PaymentPollingStatus>("idle");

  useEffect(() => {
    if (!razorpaySubscriptionId) return;

    // Reset on new subscription ID
    resolvedRef.current = false;
    startRef.current = Date.now();
    pollingStatusRef.current = "polling";

    const poll = async () => {
      // Timeout guard
      if (startRef.current && Date.now() - startRef.current > timeoutMs) {
        clearInterval(timerRef.current!);
        pollingStatusRef.current = "timeout";
        if (!resolvedRef.current) {
          resolvedRef.current = true;
          onResolved("timeout");
        }
        return;
      }

      try {
        const result = await utils.subscription.getPaymentStatus.fetch({
          razorpaySubscriptionId,
        });

        if (!result) return;

        const status = result.status as string;

        if (!PENDING_STATUSES.has(status)) {
          // Terminal state reached
          clearInterval(timerRef.current!);
          if (!resolvedRef.current) {
            resolvedRef.current = true;
            const resolvedStatus: PaymentPollingStatus = SUCCESS_STATUSES.has(
              status,
            )
              ? (status as PaymentPollingStatus)
              : "failed";
            pollingStatusRef.current = resolvedStatus;
            onResolved(resolvedStatus);
          }
        }
      } catch {
        // Network hiccup — keep polling, don't abort
      }
    };

    // Kick off immediately, then on interval
    poll();
    timerRef.current = setInterval(poll, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [razorpaySubscriptionId, intervalMs, timeoutMs, onResolved, utils]);

  return pollingStatusRef.current;
};
