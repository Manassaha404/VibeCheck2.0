"use client";

import { useEffect } from "react";
import { trpc } from "@/trpc/client";
import socket from "@/lib/socket";

export const usePollAnalytics = (slug: string, enabled: boolean = true) => {
  const query = trpc.poll.getAnalytics.useQuery(
    { slug },
    {
      enabled: enabled && !!slug,
    }
  );

  const trpcUtils = trpc.useUtils();

  useEffect(() => {
    const pollId = query.data?.pollId;
    if (!pollId) return;

    socket.connect();
    socket.emit("join:poll", pollId);


    //function for vote updates 
    const handleVoteUpdate = (payload: any) => {
      const { pollId: eventPollId, pollData } = payload;
      if (eventPollId === pollId && pollData?.optionId) {
        // Update TRPC cache directly without refetching
        trpcUtils.poll.getAnalytics.setData({ slug }, (oldData) => {
          if (!oldData) return oldData;

          const newOptions = oldData.options.map((opt) =>
            opt.id === pollData.optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );

          const totalVotes = oldData.totalVotes + 1;
          const engagementRate = oldData.totalViews > 0 
            ? Math.min(100, Math.round((totalVotes / oldData.totalViews) * 100))
            : 0;

          const newOptionsWithPercentages = newOptions.map((opt) => ({
            ...opt,
            percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
          }));

          const topAnswer = [...newOptionsWithPercentages].sort((a, b) => b.votes - a.votes)[0]?.text ?? "";

          const newDemographicData = newOptionsWithPercentages.map((opt) => ({
            label: opt.text.length > 20 ? opt.text.slice(0, 20) + "…" : opt.text,
            value: opt.percentage,
          }));

          let newComments = [...oldData.comments];
          if (pollData?.comment && pollData.comment.trim() !== "") {
            newComments = [
              {
                id: pollData.id || crypto.randomUUID(),
                username: pollData.username || "Guest",
                text: pollData.comment,
                timeAgo: "just now",
              },
              ...newComments,
            ].slice(0, 10);
          }

          const currentTimeline = [...oldData.voteTimeline];
          if (currentTimeline.length > 0) {
            const last = currentTimeline[currentTimeline.length - 1];
            if (last) {
              currentTimeline[currentTimeline.length - 1] = {
                ...last,
                votes: last.votes + 1,
                cumulative: last.cumulative + 1,
              };
            }
          } else {
            currentTimeline.push({
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              votes: 1,
              cumulative: 1,
            });
          }

          return {
            ...oldData,
            totalVotes,
            engagementRate,
            options: newOptionsWithPercentages,
            topAnswer,
            demographicData: newDemographicData,
            voteTimeline: currentTimeline,
            comments: newComments,
          };
        });
      }
    };
    //function for view updates
    const handleViewUpdate = () => {
      trpcUtils.poll.getAnalytics.setData({ slug }, (oldData) => {
        if (!oldData) return oldData;
        const totalViews = oldData.totalViews + 1;
        const engagementRate = Math.min(100, Math.round((oldData.totalVotes / totalViews) * 100));
        return {
          ...oldData,
          totalViews,
          engagementRate,
        };
      });
    };

    socket.on("update:vote", handleVoteUpdate);
    socket.on("update:view", handleViewUpdate);

    return () => {
      socket.emit("leave:poll", pollId);
      socket.off("update:vote", handleVoteUpdate);
      socket.off("update:view", handleViewUpdate);
      socket.disconnect();
    };
  }, [query.data?.pollId, slug, trpcUtils]);
  return {
    analytics: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};
