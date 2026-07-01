import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface DashboardErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function DashboardError({
  title = "VIBE CHECK FAILED!",
  message,
  onRetry,
}: DashboardErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="bg-[#FF007F] border-4 border-ink-charcoal shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] p-12 text-center max-w-lg rotate-1">
        <AlertTriangle size={64} strokeWidth={2} className="text-pure-white mx-auto mb-4" />
        <h2 className="font-display-lg text-[48px] font-black uppercase text-pure-white mb-4 leading-none">
          {title}
        </h2>
        <p className="font-bold text-pure-white/80 text-lg mb-8">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-electric-sun text-ink-charcoal font-black uppercase text-xl px-8 py-4 border-4 border-ink-charcoal shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] hover:bg-pure-white transition-colors flex items-center gap-3 mx-auto active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <RefreshCw size={24} strokeWidth={3} />
            TRY AGAIN
          </button>
        )}
      </div>
    </div>
  );
}
