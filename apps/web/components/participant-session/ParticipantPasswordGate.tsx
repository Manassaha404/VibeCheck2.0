import React from "react";
import { Lock, Eye, EyeOff, Zap, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ParticipantPasswordGateProps {
  isError: boolean;
  isPasswordError: boolean;
  error?: any;
  passwordInput: string;
  setPasswordInput: (val: string) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setPasswordError: (val: boolean) => void;
  handlePasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ParticipantPasswordGate({
  isError,
  isPasswordError,
  error,
  passwordInput,
  setPasswordInput,
  showPassword,
  setShowPassword,
  setPasswordError,
  handlePasswordSubmit,
}: ParticipantPasswordGateProps) {
  const router = useRouter();

  return (
    <div className="bg-[var(--color-canvas-cream)] min-h-screen flex flex-col bg-dot-pattern">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="relative bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl p-8 flex flex-col gap-6">
            {/* Tilted backing */}
            <div className="absolute -inset-2 bg-[var(--color-vivid-coral)] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl -rotate-2 -z-10" />

            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard">
                <Lock size={28} strokeWidth={2.5} />
              </div>
              <h1 className="font-display font-black text-headline-lg uppercase text-[var(--color-ink-charcoal)]">
                {isError && !isPasswordError
                  ? "Session Not Found"
                  : "Password Required"}
              </h1>
              {isError && !isPasswordError ? (
                <p className="font-body text-body-md text-[var(--color-on-surface-variant)]">
                  This session doesn&apos;t exist or has ended.
                </p>
              ) : (
                <p className="font-body text-body-md text-[var(--color-on-surface-variant)]">
                  This quiz is password protected. Enter the code your host
                  gave you.
                </p>
              )}
            </div>

            {(!isError || isPasswordError) && (
              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-4"
              >
                {isPasswordError && (
                  <div className="flex items-center gap-2 bg-[var(--color-error-container)] border-2 border-[var(--color-error)] px-4 py-3">
                    <AlertTriangle
                      size={18}
                      className="text-[var(--color-error)] flex-shrink-0"
                    />
                    <span className="font-body text-label-md text-[var(--color-on-error-container)]">
                      Incorrect password. Try again.
                    </span>
                  </div>
                )}
                <div className="relative">
                  <input
                    id="session-password"
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(false);
                    }}
                    placeholder="Enter session password"
                    className="w-full border-4 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] px-4 py-3 pr-12 font-body text-body-lg text-[var(--color-ink-charcoal)] placeholder-[var(--color-on-surface-variant)] focus:outline-none focus:border-[var(--color-electric-sun)] transition-colors"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-ink-charcoal)]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-[var(--color-leaf-green)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-6 py-3 font-display font-black uppercase text-headline-sm btn-press hover:bg-[var(--color-electric-sun)] transition-colors"
                >
                  <Zap size={20} strokeWidth={2.5} />
                  Join Session
                </button>
              </form>
            )}

            {isError && !isPasswordError && (
              <button
                onClick={() => router.push("/")}
                className="flex items-center justify-center gap-2 bg-[var(--color-surface-container)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-6 py-3 font-display font-bold uppercase text-label-md btn-press"
              >
                Go Home
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
