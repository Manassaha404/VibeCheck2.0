"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { X, Sparkles } from "lucide-react";

interface SubscriptionGuardContextType {
  showLimitAlert: (message: string) => void;
  closeLimitAlert: () => void;
}

export const SubscriptionGuardContext = createContext<
  SubscriptionGuardContextType | undefined
>(undefined);

export const useSubscriptionGuard = () => {
  const context = useContext(SubscriptionGuardContext);
  if (!context) {
    throw new Error(
      "useSubscriptionGuard must be used within a SubscriptionGuardProvider",
    );
  }
  return context;
};

export const SubscriptionGuardProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Ensure we're on the client before using createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  const showLimitAlert = (msg: string) => {
    setMessage(msg);
    setIsOpen(true);
  };

  const closeLimitAlert = () => {
    setIsOpen(false);
    setMessage("");
  };

  const modal = mounted
    ? createPortal(
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[var(--color-ink-charcoal)]/40 backdrop-blur-sm transition-all duration-200 ${
            isOpen
              ? "opacity-100 visible pointer-events-auto"
              : "opacity-0 invisible pointer-events-none"
          }`}
          onClick={closeLimitAlert}
        >
          <div
            className={`relative w-full max-w-md p-8 bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] shadow-hard-xl rounded-xl transition-all duration-200 ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLimitAlert}
              className="absolute top-4 right-4 p-1.5 bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] text-[var(--color-ink-charcoal)] transition-colors hover:bg-[var(--color-vivid-coral)] hover:text-white rounded-full shadow-hard-sm btn-press"
              aria-label="Close"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[var(--color-electric-sun)] border-2 border-[var(--color-ink-charcoal)] shadow-hard-sm">
                <Sparkles
                  className="w-8 h-8 text-[var(--color-ink-charcoal)]"
                  strokeWidth={2.5}
                />
              </div>
              <h2 className="mb-3 text-headline-sm font-display font-black text-[var(--color-ink-charcoal)] text-center">
                Plan Limit Reached
              </h2>
              <p className="mb-8 text-body-lg font-body text-[var(--color-ink-charcoal)]/80 text-center leading-relaxed">
                {message ||
                  "You have reached the limit for your current plan. Please upgrade to continue."}
              </p>

              <div className="flex w-full gap-4">
                <button
                  onClick={closeLimitAlert}
                  className="flex-1 px-4 py-3 text-body-lg font-display font-bold transition-colors border-2 bg-[var(--color-pure-white)] border-[var(--color-ink-charcoal)] text-[var(--color-ink-charcoal)] hover:bg-[var(--color-surface-container)] shadow-hard btn-press"
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    closeLimitAlert();
                    router.push("/pricing");
                  }}
                  className="flex-1 px-4 py-3 text-body-lg font-display font-bold transition-colors border-2 bg-[var(--color-electric-sun)] border-[var(--color-ink-charcoal)] text-[var(--color-ink-charcoal)] hover:bg-[#e5d200] shadow-hard btn-press"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <SubscriptionGuardContext.Provider value={{ showLimitAlert, closeLimitAlert }}>
      {children}
      {modal}
    </SubscriptionGuardContext.Provider>
  );
};
