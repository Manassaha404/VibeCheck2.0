"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { createPollDto } from "@repo/services/poll/model";
import { Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type CreatePollFormInput = z.input<typeof createPollDto>;

export function PollControlsSection() {
  const {
    formState: { isSubmitting },
  } = useFormContext<CreatePollFormInput>();

  const router = useRouter();

  return (
    <div className="mt-8 flex flex-col-reverse md:flex-row items-center justify-end gap-4 pt-6 border-t-2 border-[var(--color-outline-variant)] border-dashed">
      <button
        className="w-full md:w-auto px-6 py-3 font-body text-label-md text-[var(--color-ink-charcoal)] bg-transparent hover:bg-[var(--color-canvas-cream)] border-2 border-transparent hover:border-[var(--color-ink-charcoal)] rounded-lg transition-colors font-bold disabled:opacity-50"
        type="button"
        disabled={isSubmitting}
        onClick={() => router.back()}
      >
        Cancel
      </button>
      <button
        className="w-full md:w-auto px-8 py-4 font-body text-label-md font-bold text-[var(--color-ink-charcoal)] bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Creating...
          </>
        ) : (
          <>
            Create Poll
            <Send size={20} />
          </>
        )}
      </button>
    </div>
  );
}
