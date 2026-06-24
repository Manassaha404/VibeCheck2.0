"use client";

import React, { useEffect } from "react";
import { PollDraftContainer } from "../../../../../components/poll-builder/draft/PollDraftContainer";
import Navbar from "../../../../../components/Navbar";
import { useTopTags } from "../../../../../hook/tag/useTopTags";
import { useGetPoll } from "../../../../../hook/poll/useGetPoll";
import { usePollStore } from "../../../../../store/pollStore";

export default function PollDraftPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  // Fetch top tags and cache them for 15 mins (staleTime is configured in the hook)
  const { data: topTags } = useTopTags();
  
  const { data: pollResponse, isLoading } = useGetPoll(slug);
  const setCurrentPoll = usePollStore(state => state.setCurrentPoll);
  const setDraft = usePollStore(state => state.setDraft);
  const setSetup = usePollStore(state => state.setSetup);
  const currentPoll = usePollStore(state => state.currentPoll);
  
  const [hasHydrated, setHasHydrated] = React.useState(false);

  useEffect(() => {
    // Reset hydration if we switch to a different poll slug
    if (currentPoll && currentPoll.slug !== slug) {
      setHasHydrated(false);
    }
  }, [slug, currentPoll]);

  useEffect(() => {
    // Sync the fetched server state into the Zustand store ONLY ONCE per poll load
    // to prevent background refetches from overwriting the user's local edits!
    if (pollResponse && !hasHydrated) {
       const { poll, question, options, tags } = pollResponse;
       
       setCurrentPoll(poll);
       
       setSetup({
           title: poll.title,
           description: poll.description || "",
           isPublic: poll.isPublic,
           isCommentsAllowed: poll.isCommentsAllowed,
           isMultipleOptionVoteAllowed: poll.isMultipleOptionVoteAllowed,
       });

       setDraft({
           question: question?.text || "",
           options: options && options.length > 0 
             ? options.map((o: any) => ({ id: o.pollOptionId || String(o.orderIndex), text: o.text })) 
             : [
                 { id: "1", text: "Option 1" },
                 { id: "2", text: "Option 2" },
               ],
           tags: tags || [],
           allowMultipleVotes: poll.isMultipleOptionVoteAllowed,
           visibility: poll.isPublic ? "public" : "unlisted",
       });
       
       setHasHydrated(true);
    }
  }, [pollResponse, hasHydrated, setCurrentPoll, setDraft, setSetup]);

  return (
    <div className="bg-canvas-cream text-ink-charcoal min-h-screen flex flex-col font-body-lg antialiased bg-dot-pattern">
      <Navbar />
      {isLoading && (!currentPoll || currentPoll.slug !== slug) ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="animate-spin w-12 h-12 border-4 border-ink-charcoal border-t-electric-sun rounded-full"></div>
          <p className="mt-4 font-headline-sm text-ink-charcoal animate-pulse">Loading draft...</p>
        </div>
      ) : (
        <PollDraftContainer />
      )}
      {/* Footer would typically be here or in layout.tsx */}
    </div>
  );
}
