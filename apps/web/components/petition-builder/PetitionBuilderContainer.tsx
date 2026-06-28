"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petitionDraftSchema, PetitionDraftFormValues, PetitionDraftFormInput, PetitionDraftFormOutput } from "./schema";
import { PetitionForm } from "./PetitionForm";
import { PetitionPreview } from "./PetitionPreview";
import { usePetitionStore } from "../../store/petitionStore";
import { useCreatePetition } from "@/hook/petition/useCreatePetition";
import { useEffect, useState } from "react";

export function PetitionBuilderContainer() {
  const [mounted, setMounted] = useState(false);
  const draft = usePetitionStore((state) => state.draft);
  const setDraft = usePetitionStore((state) => state.setDraft);
  const { handleCreate, isCreating, apiError } = useCreatePetition();

  const methods = useForm<PetitionDraftFormInput, any, PetitionDraftFormOutput>({
    resolver: zodResolver(petitionDraftSchema),
    defaultValues: draft || {
      title: "",
      description: "",
      targetAuthority: "",
      goal: 5000,
      tags: [],
      visibility: "public",
    },
  });

  useEffect(() => {
    setMounted(true);
    if (draft) {
      methods.reset(draft);
    }
  }, []);

  // Auto-save form values to global store
  useEffect(() => {
    const subscription = methods.watch((value) => {
      setDraft(value as Partial<PetitionDraftFormValues>);
    });
    return () => subscription.unsubscribe();
  }, [methods, setDraft]);

  if (!mounted) return null;

  const onSubmit = async (data: PetitionDraftFormValues) => {
    await handleCreate(data);
  };

  return (
    <FormProvider {...methods}>
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 flex flex-col lg:flex-row gap-6 lg:gap-16 relative">

        {/* Builder Side (Left) */}
        <section className="w-full lg:w-1/2 relative z-10 flex flex-col gap-8">
          <header className="mb-4 border-b-4 border-ink-charcoal pb-8 border-dashed">
            <h1 className="font-display text-display-lg text-ink-charcoal animate-pop-in leading-[1.1]">
              <span className="text-shadow-yellow inline-block transform -rotate-2 mr-4">Build</span>
              <span className="bg-leaf-green text-ink-charcoal px-4 py-1 rounded-2xl border-4 border-ink-charcoal inline-block transform rotate-2 shadow-hard">
                Your Petition
              </span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-6 text-xl">
              Craft a narrative that moves people to action. <strong className="text-ink-charcoal underline decoration-wavy decoration-electric-sun decoration-4 underline-offset-4">Bold ideas win.</strong>
            </p>
          </header>

          <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
            {apiError && (
              <div className="mb-6 p-4 bg-red-100 text-red-800 font-body-md border-2 border-red-300 rounded shadow-hard-sm">
                {apiError}
              </div>
            )}
            <PetitionForm isSubmitting={isCreating} />
          </form>
        </section>

        {/* Preview Side (Right) */}
        <PetitionPreview />
      </main>
    </FormProvider>
  );
}
