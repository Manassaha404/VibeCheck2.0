import { useEffect } from "react";
import { trpc } from "@/trpc/client";
import socket from "@/lib/socket";

interface UsePublicPollCommentsProps {
  username: string;
  slug: string;
  pollId: string;
}

export function usePublicPollComments({ username, slug, pollId }: UsePublicPollCommentsProps) {
  const trpcUtils = trpc.useUtils();
  const { data: comments, isLoading } = trpc.poll.getPublicPollCommentsBySlug.useQuery(
    { username, slug },
    { enabled: !!username && !!slug }
  );

  useEffect(() => {
    if (!pollId) return;

    const handleVoteUpdate = (payload: any) => {
      const { pollId: eventPollId, pollData } = payload;
      if (eventPollId === pollId && pollData?.comment && pollData.comment.trim() !== "") {
        trpcUtils.poll.getPublicPollCommentsBySlug.setData({ username, slug }, (oldData) => {
          const newComment = {
            id: pollData.id || crypto.randomUUID(),
            username: pollData.username || "Guest",
            text: pollData.comment,
            timeAgo: "just now",
          };
          
          if (!oldData) return [newComment];
          return [newComment, ...oldData];
        });
      }
    };

    socket.on("vote:update", handleVoteUpdate);
    return () => {
      socket.off("vote:update", handleVoteUpdate);
    };
  }, [pollId, username, slug, trpcUtils]);

  return { comments, isLoading };
}
