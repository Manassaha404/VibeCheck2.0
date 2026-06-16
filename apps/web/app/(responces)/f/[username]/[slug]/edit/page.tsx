"use client";

import React, { useEffect, useState } from "react";
import { FileText, Star, ArrowLeft } from "lucide-react";
import { usePublicForm } from "@/hook/form/usePublicForm";
import { StaticFormPanel } from "@/components/public-form/StaticFormPanel";
import { PublicFormHeader } from "@/components/public-form/PublicFormHeader";
import { PasswordScreen } from "@/components/public-form/PasswordScreen";
import { FeedbackScreen } from "@/components/public-form/FeedbackScreen";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ username: string; slug: string }>;
}

export default function FormEditPage({ params }: PageProps) {
  const router = useRouter();
  const { username, slug } = React.use(params);

  const [isAgentComplete, setIsAgentComplete] = useState(false);
  const [password, setPassword] = useState<string | undefined>(undefined);

  // Fetch the public form data in edit mode
  const { form, isLoading, isError, isFetching } = usePublicForm(username, slug, {
    password,
    editMode: true,
  });

  const isWrongPassword = !isFetching && password !== undefined && form?.access === "password_required";

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas-cream)] flex items-center justify-center bg-dot-pattern">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] shadow-hard flex items-center justify-center animate-wiggle">
            <FileText size={24} strokeWidth={2.5} />
          </div>
          <p className="text-body-md opacity-60">Loading form…</p>
        </div>
      </div>
    );
  }

  // ── Error / Not Found ────────────────────────────────────────────────────
  if (isError || !form) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas-cream)] flex items-center justify-center bg-dot-pattern">
        <div className="bg-white border-4 border-[var(--color-ink-charcoal)] rounded-2xl shadow-hard-xl p-10 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-headline-sm mb-3">Form Not Found</h1>
          <p className="text-body-md opacity-60">
            This form doesn't exist or hasn't been published yet.
          </p>
        </div>
      </div>
    );
  }

  // ── Access Checks ────────────────────────────────────────────────────────
  if (form.access === "password_required") {
    return (
      <div className="min-h-screen bg-[var(--color-canvas-cream)] bg-dot-pattern flex flex-col">
        <PasswordScreen 
          onSubmit={setPassword} 
          error={isWrongPassword ? "Incorrect password. Please try again." : undefined}
        />
      </div>
    );
  }

  if (form.access === "expired" || form.access === "limit_reached" || form.access === "already_responded") {
    return (
      <div className="min-h-screen bg-[var(--color-canvas-cream)] bg-dot-pattern flex flex-col">
        <FeedbackScreen 
          state={form.access}
          allowEdit={"allowResponseEdit" in form ? form.allowResponseEdit : false}
          onEdit={() => {
            // Already on edit page, but if it fell through to already_responded, editing is disabled.
          }}
        />
      </div>
    );
  }

  // If granted, but no previous response exists, they shouldn't be editing.
  // We can just redirect them to the base form.
  if (form.access === "granted" && !form.responseId) {
    router.replace(`/f/${username}/${slug}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas-cream)] bg-dot-pattern flex flex-col text-[var(--color-ink-charcoal)] selection:bg-[var(--color-electric-sun)] selection:text-[var(--color-ink-charcoal)]">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <PublicFormHeader 
        mode="form" 
        setMode={() => {}} // No agent mode for editing
        isAgentComplete={isAgentComplete} 
      />

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <main className="flex-grow flex flex-col items-center py-12 md:py-16 px-4 md:px-10 max-w-3xl mx-auto w-full relative">
        
        {/* Decorative elements */}
        <div className="absolute -left-12 top-20 text-[var(--color-electric-sun)] opacity-50 hidden lg:block animate-float-slow">
          <Star size={80} strokeWidth={1} fill="currentColor" className="transform -rotate-12" />
        </div>
        <div className="absolute -right-12 bottom-40 text-[var(--color-leaf-green)] opacity-50 hidden lg:block animate-float-medium">
          <Star size={80} strokeWidth={1} fill="currentColor" className="transform rotate-12" />
        </div>

        {isAgentComplete ? (
          <FeedbackScreen 
            state="already_responded"
            allowEdit={true}
            onEdit={() => setIsAgentComplete(false)}
          />
        ) : (
          <div className="bg-white border-[3px] border-[var(--color-ink-charcoal)] shadow-hard-lg w-full p-6 md:p-12 relative z-10 transition-all duration-500 ease-in-out flex flex-col">
            
            <Link 
              href={`/f/${username}/${slug}`}
              className="inline-flex items-center gap-2 text-body-md font-bold opacity-60 hover:opacity-100 transition-opacity mb-6 w-fit"
            >
              <ArrowLeft size={18} />
              Cancel Editing
            </Link>

            {/* Title Area */}
            <div className="mb-8 border-b-[3px] border-[var(--color-ink-charcoal)] pb-6">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-[var(--color-ink-charcoal)] mb-3 leading-tight flex items-center gap-3">
                Editing: {form.title}
              </h1>
              {form.description && (
                <p className="text-body-lg text-[var(--color-on-surface-variant)] opacity-90 font-headline-sm">
                  {form.description}
                </p>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-[300px]">
              <StaticFormPanel 
                form={form as any} 
                previousAnswers={form.previousAnswers}
                responseId={form.responseId}
                onSwitchToAgent={() => {}} // Disabled for edit mode
                onSuccess={() => setIsAgentComplete(true)}
                hideAiMode={true}
              />
            </div>
          </div>
        )}
      </main>

    </div>
  );
}