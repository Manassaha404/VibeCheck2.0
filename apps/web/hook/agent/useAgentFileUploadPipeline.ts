"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRealtime } from "inngest/react";
import { realtime } from "inngest";
import { z } from "zod";
import { trpc } from "@/trpc/client";
import { useCloudinaryUpload } from "@/hook/uploads/useCloudinaryUpload";
import { useAgentSessionStore } from "@/store/agentSessionStore";

const quizAgentChannel = realtime.channel({
  name: ({ quizId }: { quizId: string }) => `quiz-agent:${quizId}`,
  topics: {
    status: {
      schema: z.object({
        status: z.string(),
        stage: z.string().optional(),
        progress: z
          .object({ totalChunks: z.number(), embeddedChunks: z.number() })
          .optional(),
        error: z.string().optional(),
        timestamp: z.string().optional(),
      }),
    },
  },
});

export type DocumentIngestStatus =
  | "idle"
  | "uploading"
  | "indexing"
  | "ready"
  | "error";

export interface DocumentIngestProgress {
  totalChunks: number;
  embeddedChunks: number;
}

export interface UseAgentFileUploadPipelineReturn {
  startPipeline: (
    file: File,
    opts: { quizId: string; conversationId?: string },
  ) => Promise<string | null>;
  pipelineStatus: DocumentIngestStatus;
  uploadProgress: number;
  indexingStage: string | null;
  indexingProgress: DocumentIngestProgress | null;
  pipelineError: string | null;
  activeDocumentId: string | null;
  reset: () => void;
}

export function useAgentFileUploadPipeline(): UseAgentFileUploadPipelineReturn {
  const [pipelineStatus, setPipelineStatus] = useState<DocumentIngestStatus>("idle");
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [indexingStage, setIndexingStage] = useState<string | null>(null);
  const [indexingProgress, setIndexingProgress] = useState<DocumentIngestProgress | null>(null);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  // Track the pending (fileName, conversationId) so we can write to global store on ready
  const pendingRef = useRef<{ fileName: string; conversationId: string } | null>(null);

  const { setDocumentReady, setUploadStatus } = useAgentSessionStore();

  const { upload, progress: uploadProgress, reset: resetUpload } = useCloudinaryUpload();

  const storeDocumentsMutation = trpc.agent.quizBuilderAgentStoreDocuments.useMutation();
  const trpcUtils = trpc.useUtils();

  const channel = useMemo(
    () =>
      activeQuizId
        ? quizAgentChannel({ quizId: activeQuizId })
        : quizAgentChannel({ quizId: "__none__" }),
    [activeQuizId],
  );

  const tokenFactory = useCallback(async () => {
    if (!activeQuizId) throw new Error("No active quiz");
    const result = await trpcUtils.agent.getRealTimeToken.fetch({
      quizId: activeQuizId,
    });
    if (!result) throw new Error("Failed to get document realtime token");
    return result.token;
  }, [activeQuizId, trpcUtils]);

  const { messages: realtimeMessages } = useRealtime({
    channel,
    topics: ["status"] as const,
    token: tokenFactory,
    enabled: !!activeQuizId && pipelineStatus === "indexing",
    bufferInterval: 100,
    autoCloseOnTerminal: false,
  });

  const latestStatus = realtimeMessages.byTopic.status;

  // Side effects belong in useEffect, not useMemo.
  useEffect(() => {
    if (!latestStatus || !activeDocumentId) return;

    const data = latestStatus.data as {
      status: "uploaded" | "processing" | "ready" | "failed";
      stage?: string;
      progress?: { totalChunks: number; embeddedChunks: number };
      error?: string;
    };

    if (data.stage) setIndexingStage(data.stage);
    if (data.progress) setIndexingProgress(data.progress);

    if (data.status === "ready") {
      setPipelineStatus("ready");
      setActiveDocumentId(null);
      setActiveQuizId(null);
      // Write to global agent session store so any hook/component can read it
      if (pendingRef.current) {
        setDocumentReady(pendingRef.current.conversationId, pendingRef.current.fileName);
        pendingRef.current = null;
      }
    } else if (data.status === "failed") {
      setPipelineError(data.error ?? "Document indexing failed");
      setPipelineStatus("error");
      setActiveDocumentId(null);
      setActiveQuizId(null);
      setUploadStatus("error");
      pendingRef.current = null;
    }
  }, [latestStatus, activeDocumentId]);

  const startPipeline = useCallback(
    async (
      file: File,
      opts: { quizId: string; conversationId?: string },
    ): Promise<string | null> => {
      try {
        setPipelineStatus("uploading");
        setUploadStatus("uploading");
        setPipelineError(null);
        setIndexingStage(null);
        setIndexingProgress(null);
        setActiveDocumentId(null);
        setActiveQuizId(opts.quizId);

        const uploadResult = await upload(file, "agent_documents");
        if (!uploadResult) {
          throw new Error("Cloudinary upload failed — no result returned");
        }
        const fileUrl = uploadResult.secureUrl;
        const documentId = crypto.randomUUID();

        setActiveDocumentId(documentId);
        setPipelineStatus("indexing");
        setUploadStatus("indexing");

        // The backend handles upserting the conversation based on quizId + userId.
        // It returns the REAL database conversation ID.
        const mutationResult = await storeDocumentsMutation.mutateAsync({
          documentId,
          fileUrl,
          quizId: opts.quizId,
          conversationId: opts.conversationId, // will be undefined if no session
        });

        if (!mutationResult) {
          throw new Error("Failed to start document indexing — no result returned");
        }

        // Set conversationId in global store immediately so it is available in state right away
        setDocumentReady(mutationResult.conversationId, file.name);

        // Stash for the realtime "ready" handler
        pendingRef.current = { fileName: file.name, conversationId: mutationResult.conversationId };

        return documentId;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Pipeline failed";
        setPipelineError(message);
        setPipelineStatus("error");
        setUploadStatus("error");
        setActiveDocumentId(null);
        pendingRef.current = null;
        return null;
      }
    },
    [upload, storeDocumentsMutation, setUploadStatus],
  );

  const reset = useCallback(() => {
    setPipelineStatus("idle");
    setPipelineError(null);
    setIndexingStage(null);
    setIndexingProgress(null);
    setActiveDocumentId(null);
    pendingRef.current = null;
    resetUpload();
  }, [resetUpload]);

  return {
    startPipeline,
    pipelineStatus,
    uploadProgress,
    indexingStage,
    indexingProgress,
    pipelineError,
    activeDocumentId,
    reset,
  };
}