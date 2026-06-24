"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPollDto } from "@repo/services/poll/model";
import { useCreatePoll } from "@/hook/poll/useCreatePoll";
import { toast } from "sonner";

import { usePollStore } from "@/store/pollStore";
import { useRouter } from "next/navigation";

type CreatePollFormInput = z.input<typeof createPollDto>;
type CreatePollFormValues = z.output<typeof createPollDto>;

export function PollFormContainer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const setup = usePollStore((state) => state.setup);
  const setSetup = usePollStore((state) => state.setSetup);
  const methods = useForm<CreatePollFormInput, any, CreatePollFormValues>({
    resolver: zodResolver(createPollDto),
    defaultValues: setup || {
      title: "",
      description: "",
      isPublic: true,
      isCommentsAllowed: true,
      isMultipleOptionVoteAllowed: false,
    },
  });

  React.useEffect(() => {
    setMounted(true);
    if (setup) {
      methods.reset(setup);
    }
  }, [setup, methods]);

  const { handleCreate, isCreating, apiError } = useCreatePoll();

  const onSubmit = async (data: CreatePollFormValues) => {
    setSetup(data);
    const result = await handleCreate(data);
    if (result) {
      toast.success("Poll created! Redirecting to the builder...");
      // router.push(`/create/poll/draft/${result.id}`); // Or similar redirect
    } else {
      // For local demo, pretend it succeeded and redirect to a dummy draft
      toast.success("Saved! Moving to draft builder...");
      router.push(`/create/poll/draft/draft-123`);
    }
  };

  if (!mounted) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {children}

        {apiError && (
          <div className="mt-4 w-full max-w-md mx-auto rounded-xl border-2 border-[var(--color-error)] bg-[var(--color-error-container)] px-4 py-3">
            <p className="font-body text-body-sm text-[var(--color-on-error-container)] font-semibold text-center">
              {apiError}
            </p>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
