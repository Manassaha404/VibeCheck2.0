"use client";

import React, { useEffect, useState } from "react";
import { FileText, Star } from "lucide-react";
import { usePublicForm } from "@/hook/form/usePublicForm";
import { AgentChatPanel } from "@/components/public-form/AgentChatPanel";
import { StaticFormPanel } from "@/components/public-form/StaticFormPanel";
import { PublicFormHeader } from "@/components/public-form/PublicFormHeader";
import { PasswordScreen } from "@/components/public-form/PasswordScreen";
import { FeedbackScreen } from "@/components/public-form/FeedbackScreen";
import { ContentErrorState } from "@/components/ui/ContentErrorState";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ username: string; slug: string }>;
}

export default function PublicFormPage({ params }: PageProps) {
  const router = useRouter();
  const { username, slug } = React.use(params);

  const [mode, setMode] = useState<"form" | "agent">("form");
  const [agentCollectedCount, setAgentCollectedCount] = useState(0);
  const [isAgentComplete, setIsAgentComplete] = useState(false);
  const [password, setPassword] = useState<string | undefined>(undefined);

  // Fetch the public form data
  const { form, isLoading, isError, session, isFetching } = usePublicForm(username, slug, {
    password,
    editMode: false,
  });

  const isWrongPassword = !isFetching && password !== undefined && form?.access === "password_required";

  useEffect(() => {
    if (session?.isCompleted) setIsAgentComplete(true);
    if (session?.hasSession && !session.isCompleted) {
      setMode("agent");
      setAgentCollectedCount(session.collectedAnswers?.length ?? 0);
    }
  }, [session]);

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
    // Try to detect archived vs generic error from the tRPC error message
    const errorMessage =
      (isError as any)?.message ?? (isError as any)?.data?.message ?? "";
    const isArchived = errorMessage.toLowerCase().includes("archived");

    return (
      <ContentErrorState
        kind="form"
        variant={isArchived ? "archived" : "not_found"}
      />
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
            router.push(`/f/${username}/${slug}/edit`);
          }}
        />
      </div>
    );
  }

  // At this point, access is "granted"
  const totalFields = form.fields.length;

  return (
    <div className={`bg-[var(--color-canvas-cream)] bg-dot-pattern flex flex-col text-[var(--color-ink-charcoal)] selection:bg-[var(--color-electric-sun)] selection:text-[var(--color-ink-charcoal)] ${mode === "agent" && !isAgentComplete ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <PublicFormHeader 
        mode={mode} 
        setMode={setMode} 
        isAgentComplete={isAgentComplete} 
      />

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <main className={`flex-grow flex flex-col items-center max-w-3xl mx-auto w-full relative ${mode === "agent" && !isAgentComplete ? "overflow-hidden p-2 md:py-8 md:px-10" : "py-8 px-4 md:py-16 md:px-10"}`}>
        
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
            allowEdit={Boolean((form as any).allowResponseEdit)}
            onEdit={() => router.push(`/f/${username}/${slug}/edit`)}
          />
        ) : (
          <div className={`bg-white border-[3px] border-[var(--color-ink-charcoal)] shadow-hard-lg w-full relative z-10 transition-all duration-500 ease-in-out flex flex-col ${mode === "agent" && !isAgentComplete ? "flex-1 min-h-0 overflow-hidden p-2 md:p-8" : "p-6 md:p-12"}`}>
            
            {/* Title Area */}
            <div className={`flex-shrink-0 border-b-[3px] border-[var(--color-ink-charcoal)] pb-4 md:pb-6 px-2 md:px-0 ${mode === "agent" && !isAgentComplete ? "mb-4" : "mb-8"}`}>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-[var(--color-ink-charcoal)] mb-2 md:mb-3 leading-tight">
                {form.title}
              </h1>
              {form.description && (
                <p className="text-body-md md:text-body-lg text-[var(--color-on-surface-variant)] opacity-90 font-headline-sm">
                  {form.description}
                </p>
              )}
            </div>

            {/* Content Area */}
            <div className={`flex flex-col ${mode === "agent" && !isAgentComplete ? "flex-1 min-h-0" : "flex-1 min-h-[300px]"}`}>
              {mode === "agent" ? (
                <div className="flex-1 flex flex-col min-h-0 animate-pop-in">
                  <AgentChatPanel
                    formId={form.formId}
                    formTitle={form.title}
                    totalFields={totalFields}
                    collectedCount={agentCollectedCount}
                    onComplete={(responseId) => setIsAgentComplete(true)}
                    onClear={() => {
                      setAgentCollectedCount(0);
                      setIsAgentComplete(false);
                    }}
                    primaryFieldId={form.fields.find((f: any) => f.isPrimary)?.fieldId}
                  />
                </div>
              ) : (
                <StaticFormPanel 
                  form={form as any} 
                  previousAnswers={form.previousAnswers}
                  responseId={form.responseId}
                  onSwitchToAgent={() => setMode("agent")} 
                  onSuccess={() => setIsAgentComplete(true)}
                />
              )}
            </div>
          </div>
        )}
      </main>

    </div>
  );
}

