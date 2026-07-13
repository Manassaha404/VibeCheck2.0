"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2, Play, Zap, Sparkles, Radio } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMakeQuizSession } from "@/hook/quiz/host/useMakeQuizSession";

interface StartSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizIdStr: string;
}

const MAX_LENGTH = 40;

const ACCENT_ICONS = [
  { icon: Zap, color: "var(--color-electric-sun)", label: "Energy" },
  { icon: Radio, color: "var(--color-vivid-coral)", label: "Live" },
  { icon: Sparkles, color: "var(--color-sky-blue)", label: "Fun" },
];

export function StartSessionModal({
  isOpen,
  onClose,
  quizIdStr,
}: StartSessionModalProps) {
  const [sessionName, setSessionName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const makeQuizSessionMutation = useMakeQuizSession(quizIdStr, onClose);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      setSessionName("");
    }
  }, [isOpen]);

  const handleStartSession = () => {
    if (!sessionName.trim() || makeQuizSessionMutation.isPending) return;
    makeQuizSessionMutation.handleStartSession(sessionName.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleStartSession();
  };

  const charRatio = sessionName.length / MAX_LENGTH;
  const barColor =
    charRatio > 0.9
      ? "var(--color-vivid-coral)"
      : charRatio > 0.65
        ? "var(--color-tangerine)"
        : "var(--color-leaf-green)";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-[520px] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl rounded-none p-0 overflow-hidden gap-0 animate-pop-in"
        style={{
          backgroundColor: "var(--color-canvas-cream)",
          backgroundImage:
            "radial-gradient(circle at center, var(--color-dot-pattern) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* ── Colourful top accent bar ────────────────────────── */}
        <div className="flex h-2 w-full">
          <div className="flex-1 bg-[var(--color-leaf-green)]" />
          <div className="flex-1 bg-[var(--color-electric-sun)]" />
          <div className="flex-1 bg-[var(--color-vivid-coral)]" />
          <div className="flex-1 bg-[var(--color-sky-blue)]" />
          <div className="flex-1 bg-[var(--color-lavender)]" />
        </div>

        <div className="p-8 flex flex-col gap-7">
          {/* ── Header ──────────────────────────────────────────── */}
          <DialogHeader className="gap-3">
            {/* Badge row */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] text-label-sm font-body font-bold px-3 py-1 border-2 border-[var(--color-ink-charcoal)] shadow-hard-sm transform -rotate-2 animate-wiggle">
                <Radio className="w-3 h-3 fill-current" />
                LIVE SESSION
              </div>
              {/* Mini icon pills */}
              <div className="flex gap-1.5 ml-auto">
                {ACCENT_ICONS.map(({ icon: Icon, color, label }) => (
                  <div
                    key={label}
                    title={label}
                    className="w-8 h-8 border-2 border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard-sm hover-lift cursor-default"
                    style={{ backgroundColor: color }}
                  >
                    <Icon
                      className="w-3.5 h-3.5 text-[var(--color-ink-charcoal)]"
                      strokeWidth={2.5}
                    />
                  </div>
                ))}
              </div>
            </div>

            <DialogTitle className="font-display font-extrabold text-[var(--color-ink-charcoal)] text-4xl leading-tight tracking-tight">
              Name Your{" "}
              <span
                className="relative inline-block"
                style={{ WebkitTextStroke: "2px var(--color-ink-charcoal)" }}
              >
                <span className="relative z-10">Session</span>
                {/* Yellow underline block */}
                <span
                  className="absolute bottom-0 left-0 right-0 h-3 bg-[var(--color-electric-sun)] -z-10 -rotate-1"
                  aria-hidden
                />
              </span>
            </DialogTitle>

            <DialogDescription className="font-body text-[var(--color-ink-charcoal)]/70 text-body-md leading-relaxed">
              Give this live session a catchy name so you and your participants
              can find it instantly. Make it fun! ✨
            </DialogDescription>
          </DialogHeader>

          {/* ── Input block ─────────────────────────────────────── */}
          <div className="flex flex-col gap-2">
            <div
              className="relative transition-all duration-200"
              style={{
                transform: isFocused ? "translate(-2px, -2px)" : "none",
              }}
            >
              <Input
                ref={inputRef}
                id="sessionName"
                placeholder={`e.g., Friday Pop Quiz ✨`}
                value={sessionName}
                maxLength={MAX_LENGTH}
                onChange={(e) => setSessionName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                className="bg-[var(--color-pure-white)] text-[var(--color-ink-charcoal)] border-4 border-[var(--color-ink-charcoal)] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 font-display placeholder:text-[var(--color-ink-charcoal)]/40 w-full transition-shadow"
                style={{
                  fontSize: "1.875rem",
                  lineHeight: "1.2",
                  fontWeight: 800,
                  padding: "1.75rem 1.5rem",
                  boxShadow: isFocused
                    ? `6px 6px 0px 0px var(--color-electric-sun)`
                    : `4px 4px 0px 0px var(--color-ink-charcoal)`,
                  borderColor: isFocused
                    ? "var(--color-electric-sun)"
                    : "var(--color-ink-charcoal)",
                }}
              />
            </div>

            {/* Character bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-[var(--color-ink-charcoal)]/10 border border-[var(--color-ink-charcoal)]/20 overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(sessionName.length / MAX_LENGTH) * 100}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
              <span
                className="text-label-sm font-body tabular-nums"
                style={{
                  color:
                    charRatio > 0.9
                      ? "var(--color-vivid-coral)"
                      : "var(--color-ink-charcoal)",
                  opacity: sessionName.length > 0 ? 1 : 0.35,
                }}
              >
                {sessionName.length}/{MAX_LENGTH}
              </span>
            </div>
          </div>

          {/* ── Tip chip ────────────────────────────────────────── */}

          {/* ── Footer ──────────────────────────────────────────── */}
          <DialogFooter className="sm:justify-end gap-3 flex-col-reverse sm:flex-row mt-1">
            <button
              id="cancel-session-btn"
              onClick={onClose}
              className="bg-[var(--color-pure-white)] text-label-md font-display font-bold text-[var(--color-ink-charcoal)] px-6 py-4 border-4 border-[var(--color-ink-charcoal)] shadow-hard btn-press transition-all flex items-center justify-center w-full sm:w-auto uppercase tracking-widest"
            >
              Cancel
            </button>

            <button
              id="start-session-btn"
              onClick={handleStartSession}
              disabled={
                !sessionName.trim() || makeQuizSessionMutation.isPending
              }
              className="relative overflow-hidden bg-[var(--color-leaf-green)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:[transform:none] text-label-md font-display font-bold text-[var(--color-ink-charcoal)] px-8 py-4 border-4 border-[var(--color-ink-charcoal)] shadow-hard btn-press transition-all flex items-center justify-center w-full sm:w-auto gap-2 uppercase tracking-widest"
            >
              {/* Animated shimmer on hover (CSS-only via pseudo, handled via group) */}
              {makeQuizSessionMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Launching…
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Start Now
                </>
              )}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
