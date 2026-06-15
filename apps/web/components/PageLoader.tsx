import React from "react";
import { Loader2 } from "lucide-react";

export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas-cream bg-dot-pattern theme-transition">
      <div className="flex flex-col items-center gap-10 animate-pop-in">
        {/* Floating Box */}
        <div className="animate-float-slow">
          <div className="bg-electric-sun border-4 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] rounded-2xl p-8 flex items-center justify-center rotate-3 animate-wiggle">
            <Loader2 className="w-16 h-16 text-ink-charcoal animate-spin" strokeWidth={3} />
          </div>
        </div>

        {/* Loading Text */}
        <div className="bg-pure-white border-4 border-ink-charcoal shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] px-8 py-3 rounded-full hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] transition-all">
          <h2 className="text-headline-sm font-bold uppercase tracking-wider text-ink-charcoal animate-pulse">
            {message}
          </h2>
        </div>
      </div>
    </div>
  );
}
