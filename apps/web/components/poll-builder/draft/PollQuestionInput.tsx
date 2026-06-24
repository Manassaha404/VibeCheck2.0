"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { PollDraftFormValues } from "./schema";

export function PollQuestionInput() {
  const { register, formState: { errors } } = useFormContext<PollDraftFormValues>();

  return (
    <div className="relative animate-fade-up" style={{ animationDelay: '0ms' }}>
      {/* Mascot Suggestion (moved outside to prevent clipping) */}
      <div className="absolute -top-10 -right-6 hidden md:flex items-center gap-2 z-20 animate-float-slow pointer-events-none">
        <div className="bg-canvas-cream border-2 border-ink-charcoal p-2 rounded-lg text-label-sm font-label-sm max-w-[150px] relative pointer-events-auto">
          Try asking something spicy!
          <div className="absolute -bottom-2 right-4 w-3 h-3 bg-canvas-cream border-b-2 border-r-2 border-ink-charcoal transform rotate-45"></div>
        </div>
        <img
          alt="Mascot"
          className="w-12 h-12 rounded-full border-2 border-ink-charcoal bg-leaf-green object-cover pointer-events-auto"
          src="https://api.dicebear.com/7.x/bottts/svg?seed=vibecheck"
        />
      </div>

      <div className="bg-pure-white border-2 border-ink-charcoal shadow-hard-lg p-6 rounded-xl relative overflow-hidden card-lift">
        <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-electric-sun)] border-b-2 border-ink-charcoal"></div>

        <label className="block font-headline-sm text-headline-sm text-ink-charcoal mb-4 mt-2">
          What's the question?
        </label>
      <textarea
        {...register("question")}
        className="w-full bg-pure-white border-2 border-ink-charcoal rounded p-4 font-body-lg text-body-lg focus:outline-none focus:ring-2 focus:ring-electric-sun focus:border-electric-sun resize-none h-32"
        placeholder="e.g., Tabs or Spaces? (Wrong answers only)"
      />
        {errors.question && (
          <p className="text-error font-label-sm text-label-sm mt-2">
            {errors.question.message}
          </p>
        )}
      </div>
    </div>
  );
}
