import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HardDrive, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import gsap from "gsap";

interface DriveIntegrationCardProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
  isDisconnecting: boolean;
}

export const DriveIntegrationCard: React.FC<DriveIntegrationCardProps> = ({
  isConnected,
  onConnect,
  onDisconnect,
  isConnecting,
  isDisconnecting,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle entry animation for the card content
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.3 },
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className={`bg-[var(--color-surface)] border-4 border-[var(--color-ink-charcoal)] shadow-neubrutalist p-6 relative overflow-hidden transition-colors ${isConnected ? "bg-[var(--color-leaf-green)]/20" : ""}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div
            className={`p-4 rounded-full border-2 border-[var(--color-ink-charcoal)] shadow-hard-sm ${isConnected ? "bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)]" : "bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)]"}`}
          >
            <HardDrive className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-headline-sm font-display font-black text-[var(--color-ink-charcoal)] flex items-center gap-2">
              Google Drive
              {isConnected ? (
                <CheckCircle2
                  className="w-5 h-5 text-[var(--color-primary)]"
                  strokeWidth={3}
                />
              ) : (
                <XCircle
                  className="w-5 h-5 text-[var(--color-vivid-coral)]"
                  strokeWidth={3}
                />
              )}
            </h3>
            <p className="text-body-md font-bold text-[var(--color-ink-charcoal)]/80 mt-1 max-w-md">
              {isConnected
                ? "Your account is connected. Backups and exports will be saved here."
                : "Connect your drive to enable direct backups and file exports."}
            </p>
          </div>
        </div>

        <button
          onClick={isConnected ? onDisconnect : onConnect}
          disabled={isConnecting || isDisconnecting}
          className={`px-6 py-3 font-display font-black text-label-md border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press flex items-center gap-2 ${
            isConnected
              ? "bg-[var(--color-vivid-coral)] text-[var(--color-ink-charcoal)] hover:bg-[#ff4f4f]"
              : "bg-[var(--color-sky-blue)] text-[var(--color-ink-charcoal)] hover:bg-[#34b6f2]"
          } disabled:opacity-60 disabled:pointer-events-none`}
        >
          {(isConnecting || isDisconnecting) && (
            <Loader2 className="w-5 h-5 animate-spin" />
          )}
          {!isConnecting &&
            !isDisconnecting &&
            (isConnected ? "DISCONNECT" : "CONNECT")}
        </button>
      </div>
    </div>
  );
};
