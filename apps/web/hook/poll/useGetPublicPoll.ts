import { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import socket from "@/lib/socket";

export interface LocalResult {
  pollOptionId: string;
  text: string;
  votes: number;
  percentage: number;
}

export const useGetPublicPoll = (username: string, slug: string) => {
  const [voted, setVoted] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localResults, setLocalResults] = useState<LocalResult[]>([]);
  const [localTotalVotes, setLocalTotalVotes] = useState(0);
  const [hasViewed, setHasViewed] = useState(false);

  const query = trpc.poll.getPublicPollBySlug.useQuery(
    { username, slug },
    { enabled: !!username && !!slug }
  );

  // Synchronize state if user has already voted
  useEffect(() => {
    if (query.data?.userVoteId && query.data?.results) {
      setVoted(true);
      setSelectedOptionId(query.data.userVoteId);
      
      const results = query.data.results as any[];
      const total = results.reduce((s: number, o: any) => s + (o.votes || 0), 0);
      setLocalTotalVotes(total);
      
      setLocalResults(results.map((o: any) => ({
        pollOptionId: o.pollOptionId ?? o.id,
        text: o.text,
        votes: o.votes || 0,
        percentage: total > 0 ? Math.round(((o.votes || 0) / total) * 100) : 0,
      })));
    }
  }, [query.data?.userVoteId, query.data?.results]);

  
  useEffect(() => {
    //function for update vote count
    const handleVoteUpdate = (payload: any) => {
      const { pollId, pollData } = payload;
      if (pollId === query.data?.poll?.pollId && pollData?.optionId) {
        setLocalResults((prev) => {
          const base = prev.length > 0 ? prev : (query.data?.options?.map(o => ({...o, votes: 0, percentage: 0})) ?? []);
          const updated = base.map((o) =>
            o.pollOptionId === pollData.optionId
              ? { ...o, votes: (o.votes || 0) + 1 }
              : o
          );
          const total = updated.reduce((s, o) => s + (o.votes || 0), 0);
          
          setLocalTotalVotes(total); // Keep total in sync
          
          return updated.map((o) => ({
            ...o,
            percentage: total > 0 ? Math.round(((o.votes || 0) / total) * 100) : 0,
          }));
        });
      }
    };
    //socket client event
    socket.on("update:vote", handleVoteUpdate);

    //clean up
    return () => {
      socket.off("update:vote", handleVoteUpdate);
    };
  }, [query.data?.poll?.pollId, query.data?.options]);

  const trpcContext = trpc.useUtils();
  const submitVoteMutation = trpc.poll.submitVote.useMutation();
  const newViewMutation = trpc.poll.newView.useMutation();

  useEffect(() => {
    if (query.data?.poll?.pollId && !hasViewed) {
      newViewMutation.mutate({ pollId: query.data.poll.pollId });
      setHasViewed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.poll?.pollId, hasViewed]);

  const handleSubmitVote = async (voteData: { optionId: string; comment: string }) => {
    setIsSubmitting(true);
    try {
      //fetch form from database
      const realResults = await trpcContext.client.poll.getPublicPollResultsBySlug.query({ username, slug });
      
      // Optimistic update: use the real results as the base, and add the user's new vote
      setLocalResults((prev) => {
        const base = realResults && realResults.length > 0 ? realResults : (query.data?.options?.map(o => ({...o, votes: 0, percentage: 0})) ?? []);
        const updated = base.map((o) =>
          o.pollOptionId === voteData.optionId ? { ...o, votes: (o.votes || 0) + 1 } : o
        );
        const total = updated.reduce((s, o) => s + o.votes, 0);
        
        setLocalTotalVotes(total);
        
        return updated.map((o) => ({
          ...o,
          percentage: total > 0 ? Math.round((o.votes / total) * 100) : 0,
        }));
      });

      setSelectedOptionId(voteData.optionId);

      //socket event;
      socket.emit("submit:poll", query.data?.poll?.pollId, {
        optionId: voteData.optionId,
        comment: voteData.comment,
        username: "Guest", // Or grab from context if auth is added later
        id: crypto.randomUUID(),
      });

      //database entry
      await submitVoteMutation.mutateAsync({
        pollId: query.data?.poll?.pollId!,
        optionId: voteData.optionId,
        comment: voteData.comment,
      });

      
      window.scrollTo({ top: 0, behavior: "smooth" });
      await new Promise((r) => setTimeout(r, 350));
      setVoted(true);
    } catch {
      toast.error("Failed to submit vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...query,
    voted,
    selectedOptionId,
    isSubmitting,
    localResults,
    localTotalVotes,
    handleSubmitVote,
  };
};
