"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { PollDraftFormValues } from "./schema";

export function PollSettingsPanel() {
  const { register, watch, setValue } = useFormContext<PollDraftFormValues>();
  const allowMultipleVotes = watch("allowMultipleVotes");
  const visibility = watch("visibility");

  return (
    <div className="bg-pure-white border-2 border-ink-charcoal shadow-hard-lg p-6 rounded-xl flex flex-col gap-6 relative overflow-hidden card-lift animate-fade-up" style={{ animationDelay: '300ms' }}>
      <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-lavender)] border-b-2 border-ink-charcoal"></div>
      <h2 className="font-headline-sm text-headline-sm text-ink-charcoal mt-2">Settings</h2>
      
      {/* Toggle: Allow Multiple Votes */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-label-md text-label-md text-ink-charcoal">Allow Multiple Votes</div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">Users can select more than one option.</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            {...register("allowMultipleVotes")}
            className="sr-only peer"
          />
          <div className="w-14 h-8 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-pure-white after:border-ink-charcoal after:border-2 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-leaf-green border-2 border-ink-charcoal shadow-hard-sm"></div>
        </label>
      </div>

      {/* Visibility Settings */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-label-md text-label-md text-ink-charcoal">Visibility</div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">Select public or unlisted.</div>
        </div>
        <div className="flex bg-surface-container p-1 rounded-xl border-2 border-ink-charcoal shadow-hard-sm">
          <button
            type="button"
            onClick={() => setValue("visibility", "public")}
            className={`px-6 py-2 flex-1 rounded-lg font-bold transition-all border-2 ${
              visibility === "public"
                ? "bg-leaf-green border-ink-charcoal shadow-hard-sm text-ink-charcoal"
                : "border-transparent text-on-surface-variant hover:text-ink-charcoal"
            }`}
          >
            Public
          </button>
          <button
            type="button"
            onClick={() => setValue("visibility", "unlisted")}
            className={`px-6 py-2 flex-1 rounded-lg font-bold transition-all border-2 ${
              visibility === "unlisted"
                ? "bg-leaf-green border-ink-charcoal shadow-hard-sm text-ink-charcoal"
                : "border-transparent text-on-surface-variant hover:text-ink-charcoal"
            }`}
          >
            Unlisted
          </button>
        </div>
      </div>
    </div>
  );
}
