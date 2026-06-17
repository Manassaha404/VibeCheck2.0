"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FormSetupHeader } from "@/components/form-builder/setup/FormSetupHeader";
import { GeneralDetailsSection } from "@/components/form-builder/setup/GeneralDetailsSection";
import { SecuritySettingsSection } from "@/components/form-builder/setup/SecuritySettingsSection";
import { ControlsSection } from "@/components/form-builder/setup/ControlsSection";
import { IntegrationsSection } from "@/components/form-builder/setup/IntegrationsSection";
import { useDraftForm } from "@/hook/form/useCreateForm";
import { useCreateFormStore } from "@/store/formStore/createFormStore";
import { useRouter } from "next/navigation";

export default function FormSetupPage() {
  const { handleDraft, isDrafting, apiError, setApiError } = useDraftForm();
  const formState = useCreateFormStore();
  const router = useRouter();

  const onDraftClick = async () => {
    const trimmedTitle = formState.title.trim();
    if (trimmedTitle.length <= 1) {
      setApiError("Title must be longer than 1 character.");
      return;
    }

    if (formState.passwordNeeded && (!formState.password || formState.password.trim().length <= 1)) {
      setApiError("Password must be longer than 1 character.");
      return;
    }

    setApiError(null);

    let currentSlug = formState.slug || `form-${crypto.randomUUID().substring(0, 8)}`;
    let success = false;
    let attempt = 0;

    while (!success && attempt < 5) {
      try {
        success = await handleDraft({
          title: trimmedTitle,
          description: formState.description || null,
          slug: currentSlug,
          passwordNeeded: formState.passwordNeeded,
          password: formState.passwordNeeded ? formState.password || "defaultPass" : "not_set",
          isCommentsAllowed: formState.isCommentsAllowed,
          expiresAt: formState.expiresAt ? new Date(formState.expiresAt).toISOString() : null,
          responseLimit: formState.responseLimit || null,
          allowResponseEdit: formState.allowResponseEdit,
        });
      } catch (error: any) {
        if (error.message === "slug already exists") {
          attempt++;
          if (attempt >= 5) {
            setApiError("Slug is consistently conflicting. Please try a completely different slug.");
            break;
          }
          currentSlug = `${formState.slug || `form-${crypto.randomUUID().substring(0, 8)}`}-${crypto.randomUUID().substring(0, 4)}`;
        } else {
          break;
        }
      }
    }

    if (success) {
      router.push(`/create/form/draft/${encodeURIComponent(currentSlug)}`);
    }
  };

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
          
          <FormSetupHeader />

          {/* Form Builder Layout */}
          <div className="flex flex-col gap-8 relative z-10">
            
            <GeneralDetailsSection />

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-8">
                <SecuritySettingsSection />
                <IntegrationsSection />
              </div>
              <ControlsSection />
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4 mt-8">
              {apiError && (
                <div className="text-red-600 font-bold bg-red-100 px-4 py-2 rounded border-2 border-red-600">
                  {apiError}
                </div>
              )}
              <button 
                onClick={onDraftClick}
                disabled={isDrafting}
                className={`font-label-md text-label-md px-10 py-4 ${isDrafting ? 'bg-surface-variant' : 'bg-leaf-green hover:bg-primary-fixed hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(44,46,42,1)]'} text-ink-charcoal border-4 border-ink-charcoal rounded shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none whitespace-nowrap text-lg uppercase tracking-wider font-bold`}
              >
                {isDrafting ? "Drafting..." : "Let's Draft"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
