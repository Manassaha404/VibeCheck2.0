"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PollSetupHeader } from "@/components/poll-builder/setup/PollSetupHeader";
import { PollGeneralDetailsSection } from "@/components/poll-builder/setup/PollGeneralDetailsSection";
import { PollSettingsSection } from "@/components/poll-builder/setup/PollSettingsSection";
import { PollFormContainer } from "@/components/poll-builder/setup/PollFormContainer";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { createPollDto } from "@repo/services/poll/model";

type CreatePollFormInput = z.input<typeof createPollDto>;

function PollActions() {
  const {
    formState: { isSubmitting },
  } = useFormContext<CreatePollFormInput>();

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <button
        type="submit"
        disabled={isSubmitting}
        className={`font-label-md text-label-md px-10 py-4 ${
          isSubmitting
            ? "bg-surface-variant cursor-not-allowed opacity-60"
            : "bg-leaf-green hover:bg-primary-fixed hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(44,46,42,1)]"
        } text-ink-charcoal border-4 border-ink-charcoal rounded shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none whitespace-nowrap text-lg uppercase tracking-wider font-bold`}
      >
        {isSubmitting ? "Creating..." : "Create Poll"}
      </button>
    </div>
  );
}

export default function CreatePollPage() {
  return (
    <div className="bg-canvas-cream min-h-screen flex flex-col font-body-md text-on-surface bg-dot-pattern">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow w-full px-4 md:px-10 py-12 md:py-24 relative overflow-hidden">

        {/* Decorative Floating Shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-vivid-coral rounded-full border-4 border-ink-charcoal hard-shadow animate-float-slow hidden md:block" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-mint border-4 border-ink-charcoal rotate-12 hard-shadow animate-wiggle hidden md:block" />
        <div className="absolute top-1/4 right-10 w-28 h-28 bg-tangerine rounded-full border-4 border-ink-charcoal hard-shadow animate-float-medium hidden md:block" />
        <div className="absolute bottom-10 right-24 w-36 h-36 bg-sky-blue border-4 border-ink-charcoal -rotate-6 hard-shadow animate-float-slow hidden md:block" />
        <div className="absolute top-1/2 left-8 w-16 h-16 bg-lavender rounded-xl border-4 border-ink-charcoal rotate-45 hard-shadow animate-float-slow hidden md:block" />

        <div className="max-w-4xl mx-auto relative z-10">

          <PollSetupHeader />

          {/* Poll Builder Layout */}
          <PollFormContainer>
            <div className="flex flex-col gap-8 relative z-10">

              <PollGeneralDetailsSection />

              <PollSettingsSection />

              <PollActions />
            </div>
          </PollFormContainer>

        </div>
      </main>

      <Footer />
    </div>
  );
}
