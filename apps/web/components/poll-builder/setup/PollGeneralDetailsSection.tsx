"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { createPollDto } from "@repo/services/poll/model";

type CreatePollFormInput = z.input<typeof createPollDto>;

export function PollGeneralDetailsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreatePollFormInput>();

  return (
    <section className="bg-pure-white border-4 border-ink-charcoal rounded-DEFAULT shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] p-6 md:p-8 relative">
      <div className="absolute -top-4 -left-4 bg-leaf-green border-2 border-ink-charcoal rounded-DEFAULT px-3 py-1 font-label-md text-label-md text-ink-charcoal shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] rotate-[-2deg]">
        01. The Basics
      </div>
      <div className="space-y-6 mt-4">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label
            className="font-label-md text-label-md uppercase tracking-wider flex items-center gap-2"
            htmlFor="poll-title"
          >
            Poll Title
          </label>
          <input
            {...register("title")}
            className={`w-full bg-surface-container-lowest border-2 border-ink-charcoal rounded-DEFAULT p-4 font-body-lg text-body-lg focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0px_0px_rgba(44,46,42,0.1)] ${
              errors.title ? "border-red-600" : "focus:border-leaf-green"
            }`}
            id="poll-title"
            placeholder="e.g. Weekly Vibe Check"
            type="text"
          />
          {errors.title && (
            <p className="font-body-sm text-red-600 font-bold mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label
            className="font-label-md text-label-md uppercase tracking-wider flex items-center gap-2"
            htmlFor="poll-desc"
          >
            Description{" "}
            <span className="text-on-surface-variant font-normal normal-case ml-2 text-sm">
              (Optional)
            </span>
          </label>
          <textarea
            {...register("description")}
            className={`w-full bg-surface-container-lowest border-2 border-ink-charcoal rounded-DEFAULT p-4 font-body-md text-body-md focus:outline-none focus:ring-0 transition-colors shadow-[4px_4px_0px_0px_rgba(44,46,42,0.1)] resize-y ${
              errors.description ? "border-red-600" : "focus:border-leaf-green"
            }`}
            id="poll-desc"
            placeholder="Tell them why they should care..."
            rows={4}
          />
          {errors.description && (
            <p className="font-body-sm text-red-600 font-bold mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
