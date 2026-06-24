"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { pollDraftSchema } from "./schema";
import { PollQuestionInput } from "./PollQuestionInput";
import { PollOptionsList } from "./PollOptionsList";
import { PollTagsInput } from "./PollTagsInput";
import { PollSettingsPanel } from "./PollSettingsPanel";
import { Save, Rocket } from "lucide-react";
import { toast } from "sonner";
import { usePollStore } from "@/store/pollStore";
import { usePublishPoll } from "@/hook/poll/usePublishPoll";
import { useSaveDraft } from "@/hook/poll/useSaveDraft";
import { useRouter } from "next/navigation";
import { SavePollDraftDtoType } from "@repo/services/poll/model";

type PollDraftFormInput = z.input<typeof pollDraftSchema>;
type PollDraftFormOutput = z.output<typeof pollDraftSchema>;

export function PollDraftContainer() {
  const [mounted, setMounted] = useState(false);
  const draft = usePollStore((state) => state.draft);
  const setup = usePollStore((state) => state.setup);
  const setDraft = usePollStore((state) => state.setDraft);
  const currentPoll = usePollStore((state) => state.currentPoll);
  
  const router = useRouter();
  const { handlePublish, isPublishing } = usePublishPoll();
  const { handleSave, isSaving } = useSaveDraft();

  const methods = useForm<PollDraftFormInput, any, PollDraftFormOutput>({
    resolver: zodResolver(pollDraftSchema),
    defaultValues: draft || {
      question: "",
      options: [
        { id: "1", text: "Option 1" },
        { id: "2", text: "Option 2" },
      ],
      tags: [],
      allowMultipleVotes: setup?.isMultipleOptionVoteAllowed ?? false,
      visibility: setup?.isPublic === false ? "unlisted" : "public",
    },
  });

  useEffect(() => {
    setMounted(true);
    if (draft) {
      methods.reset(draft);
    } else if (setup) {
      methods.reset({
        question: "",
        options: [
          { id: "1", text: "Option 1" },
          { id: "2", text: "Option 2" },
        ],
        tags: [],
        allowMultipleVotes: setup.isMultipleOptionVoteAllowed ?? false,
        visibility: setup.isPublic === false ? "unlisted" : "public",
      });
    }
  }, [draft, setup, methods]);

  const constructDto = (data: PollDraftFormOutput): SavePollDraftDtoType => {
    return {
      question: {
        text: data.question,
        options: data.options.map((opt, i) => ({ text: opt.text, orderIndex: i })),
      },
      isPublic: data.visibility === "public",
      isCommentsAllowed: setup?.isCommentsAllowed ?? true,
      isMultipleOptionVoteAllowed: data.allowMultipleVotes,
      status: "draft",
    };
  };

  const onSubmit = async (data: PollDraftFormOutput) => {
    if (!currentPoll?.pollId) {
      toast.error("Poll ID is missing.");
      return;
    }
    
    // We update the DTO status directly before publishing
    const draftDto = constructDto(data);
    draftDto.status = "active";
    draftDto.isPublished = true;
    
    const success = await handlePublish(currentPoll.pollId, draftDto, data.tags);
    if (success) {
      router.push(`/poll/${currentPoll.slug}`);
    }
  };

  const handleSaveDraft = async () => {
    const data = methods.getValues();
    setDraft(data);

    if (currentPoll?.pollId) {
      const draftDto = constructDto(data);
      await handleSave(currentPoll.pollId, draftDto);
    } else {
      toast.error("Could not save to server. Poll ID missing.");
    }
  };

  if (!mounted) return null;

  return (
    <FormProvider {...methods}>
      <main className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-8">
        <section className="w-full flex flex-col gap-8">
          <div className="flex flex-col gap-8 mb-4 border-b-4 border-ink-charcoal pb-8 border-dashed">
            <h1 className="font-display text-display-lg text-ink-charcoal animate-pop-in leading-[1.1]">
              <span className="text-shadow-yellow inline-block transform -rotate-1 mr-4">Build</span>
              <span className="bg-electric-sun px-4 py-1 rounded-2xl border-4 border-ink-charcoal inline-block transform rotate-2 shadow-hard">
                Your Poll
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving || isPublishing}
                className="bg-pure-white text-ink-charcoal px-6 py-3 border-4 border-ink-charcoal shadow-hard rounded-xl font-headline-sm text-headline-sm hover:bg-canvas-cream transition-all active:translate-y-2 active:shadow-none flex items-center justify-center gap-3 w-full sm:w-auto hover-lift disabled:opacity-50"
              >
                <Save size={24} /> {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="submit"
                form="poll-draft-form"
                disabled={isSaving || isPublishing}
                className="bg-leaf-green text-ink-charcoal px-8 py-3 border-4 border-ink-charcoal shadow-hard rounded-xl font-headline-sm text-headline-sm hover:bg-electric-sun transition-all active:translate-y-2 active:shadow-none flex items-center justify-center gap-3 w-full sm:w-auto hover-lift disabled:opacity-50"
              >
                {isPublishing ? "Publishing..." : "Publish"} <Rocket size={24} />
              </button>
            </div>
          </div>

          <form
            id="poll-draft-form"
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            {/* Question Input */}
            <PollQuestionInput />

            {/* Options */}
            <PollOptionsList />

            {/* Tags Input (NEW) */}
            <PollTagsInput />

            {/* Settings */}
            <PollSettingsPanel />

          </form>
        </section>
      </main>
    </FormProvider>
  );
}
