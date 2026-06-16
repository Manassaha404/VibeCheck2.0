import React from "react";
import Link from "next/link";
import { Sparkles, FileText } from "lucide-react";

interface PublicFormHeaderProps {
  mode: "form" | "agent";
  setMode: (mode: "form" | "agent") => void;
  isAgentComplete: boolean;
}

export function PublicFormHeader({ mode, setMode, isAgentComplete }: PublicFormHeaderProps) {
  return (
    <header className="bg-[var(--color-canvas-cream)] border-b-2 border-[var(--color-ink-charcoal)] shadow-[4px_4px_0px_0px_var(--color-ink-charcoal)] w-full top-0 sticky z-50 transition-all">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 w-full max-w-[1280px] mx-auto">
        <Link href="/" className="text-headline-sm md:text-headline-md font-black text-[var(--color-ink-charcoal)]">
          VibeCheck
        </Link>
        
        {/* Mode toggle */}
        {!isAgentComplete && (
          <div className="flex-shrink-0 flex items-center bg-white border-2 border-[var(--color-ink-charcoal)] rounded-xl p-1 gap-1 shadow-hard-sm">
            <button
              onClick={() => setMode("form")}
              className={`px-3 py-1.5 rounded-lg text-label-sm transition-all ${
                mode === "form"
                  ? "bg-[var(--color-electric-sun)] border-2 border-[var(--color-ink-charcoal)] shadow-hard-sm"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              📝 Form
            </button>
            <button
              onClick={() => setMode("agent")}
              className={`px-3 py-1.5 rounded-lg text-label-sm transition-all flex items-center gap-1.5 ${
                mode === "agent"
                  ? "bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] shadow-hard-sm"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <Sparkles size={13} />
              AI Chat
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
