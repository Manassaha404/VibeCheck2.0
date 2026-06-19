import React, { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";

export function PasswordScreen({
  onSubmit,
  error,
}: {
  onSubmit: (password: string) => void;
  error?: string;
}) {
  const [password, setPassword] = useState("");

  return (
    <div className="bg-white border-[3px] border-[var(--color-ink-charcoal)] shadow-hard-lg w-[90%] md:w-full max-w-md p-6 md:p-12 text-center relative z-10 flex flex-col items-center justify-center animate-pop-in mx-auto mt-12 md:mt-20">
      <div className="w-20 h-20 bg-[var(--color-electric-sun)] rounded-2xl border-[3px] border-[var(--color-ink-charcoal)] shadow-hard mb-6 flex items-center justify-center">
        <Lock size={40} strokeWidth={2.5} className="text-[var(--color-ink-charcoal)]" />
      </div>

      <h2 className="font-headline-lg text-[var(--color-ink-charcoal)] mb-3">Password Required</h2>
      <p className="text-body-md opacity-80 mb-8">
        This form is password protected. Please enter the password to access it.
      </p>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (password) onSubmit(password);
        }}
        className="w-full space-y-4"
      >
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full bg-[var(--color-canvas-cream)] text-body-lg text-[var(--color-ink-charcoal)] py-4 px-5 border-[3px] border-[var(--color-ink-charcoal)] focus:outline-none focus:ring-4 focus:ring-[var(--color-electric-sun)] transition-all font-bold placeholder:opacity-50"
            autoFocus
          />
        </div>
        
        {error && (
          <p className="text-[#FF4444] font-bold text-sm text-left">{error}</p>
        )}
        
        <button
          type="submit"
          disabled={!password}
          className="w-full bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)] font-bold text-headline-sm py-4 px-8 border-[3px] border-[var(--color-ink-charcoal)] shadow-hard hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-none active:bg-[var(--color-primary-container)] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
        >
          Access Form
          <ArrowRight size={24} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
