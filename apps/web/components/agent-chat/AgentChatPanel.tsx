"use client";

import React, { useEffect, useRef, useState } from "react";
import AgentChatHeader from "./AgentChatHeader";
import AgentMessageBubble, { AgentMessage } from "./AgentMessageBubble";
import AgentChatInput from "./AgentChatInput";
import AgentFileUpload from "./AgentFileUpload";
import { Loader2, Bot, FileCheck2, UploadCloud } from "lucide-react";
import { useAgentFileUploadPipeline } from "@/hook/agent/useAgentFileUploadPipeline";
import { useQuizBuilderAgentChat } from "@/hook/agent/useQuizBuilderAgentChat";
import { useAgentSessionStore } from "@/store/agentSessionStore";
import { useQuizStore } from "@/store/quizStore";

interface AgentChatPanelProps {
  onClose: () => void;
  onMinimize: () => void;
  quizId: string;
}

export default function AgentChatPanel({
  onClose,
  onMinimize,
  quizId,
}: AgentChatPanelProps) {
  const [showUpload, setShowUpload] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversationId,
    hasUploadedDocument,
    uploadedFileNames,
    resetSession,
  } = useAgentSessionStore();
  const questions = useQuizStore((s) => s.questions);

  useEffect(() => {
    resetSession();
  }, [quizId]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    messages,
    inputValue,
    setInputValue,
    handleSend,
    handleClearHistory,
    isGenerating,
    pushMessage,
  } = useQuizBuilderAgentChat(quizId);

  const {
    startPipeline,
    pipelineStatus,
    uploadProgress,
    pipelineError,
    reset: resetPipeline,
  } = useAgentFileUploadPipeline();

  const isFileProcessing =
    pipelineStatus === "uploading" || pipelineStatus === "indexing";
  const isDisabled = isGenerating || isFileProcessing;

  const handleNewConversation = async () => {
    await handleClearHistory();
    resetSession();
    resetPipeline();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating, pipelineStatus]);

  useEffect(() => {
    if (pipelineStatus === "ready") {
      pushMessage({
        role: "agent",
        content:
          "✅ Your document has been indexed! You can now ask me questions about it.",
      });
    }
  }, [pipelineStatus, pushMessage]);

  useEffect(() => {
    if (pipelineStatus === "error" && pipelineError) {
      pushMessage({
        role: "agent",
        content: `❌ Failed to process your document: ${pipelineError}`,
      });
      resetPipeline();
    }
  }, [pipelineStatus, pipelineError, resetPipeline, pushMessage]);

  const handleFileSelect = async (file: File) => {
    setShowUpload(false);

    pushMessage({
      role: "user",
      content: `Uploaded: ${file.name}`,
      fileName: file.name,
    });

    await startPipeline(file, {
      quizId,
      conversationId: conversationId ?? undefined,
    });
  };

  const renderPipelineBanner = () => {
    if (pipelineStatus === "uploading") {
      return (
        <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-2 rounded border-2 border-ink-charcoal bg-lavender shadow-[2px_2px_0px_0px_rgba(44,46,42,1)]">
          <UploadCloud className="w-4 h-4 text-ink-charcoal shrink-0 animate-bounce" />
          <span className="text-label-sm font-bold text-ink-charcoal flex-1">
            Uploading your file…
          </span>
          <div className="w-24 h-1.5 bg-pure-white border border-ink-charcoal rounded-full overflow-hidden">
            <div
              className="h-full bg-electric-sun transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      );
    }

    if (pipelineStatus === "indexing") {
      return (
        <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-2 rounded border-2 border-ink-charcoal bg-mint shadow-[2px_2px_0px_0px_rgba(44,46,42,1)]">
          <Loader2 className="w-4 h-4 text-ink-charcoal shrink-0 animate-spin" />
          <span className="text-label-sm font-bold text-ink-charcoal">
            Reading your document…
          </span>
        </div>
      );
    }

    if (pipelineStatus === "ready") {
      return (
        <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-2 rounded border-2 border-ink-charcoal bg-electric-sun shadow-[2px_2px_0px_0px_rgba(44,46,42,1)]">
          <FileCheck2 className="w-4 h-4 text-ink-charcoal shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-label-sm font-bold text-ink-charcoal block">
              Document ready — ask away!
            </span>
            {uploadedFileNames.length > 0 && (
              <span className="text-label-sm text-ink-charcoal/70 truncate block">
                {uploadedFileNames.join(", ")}
              </span>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="fixed bottom-6 right-6 w-80 md:w-96 h-[32rem] bg-pure-white border-2 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] rounded-lg flex flex-col z-50 overflow-hidden font-body-md transition-all animate-in slide-in-from-bottom-10"
      role="dialog"
      aria-label="Quiz Maker Agent Chat"
    >
      <AgentChatHeader
        onClose={onClose}
        onMinimize={onMinimize}
        onNewConversation={handleNewConversation}
      />

      <div
        className="flex-1 overflow-y-auto p-4 bg-canvas-cream space-y-4"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <AgentMessageBubble key={msg.id} message={msg} />
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%] flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded border-2 border-ink-charcoal flex items-center justify-center bg-lavender">
                <Bot className="w-5 h-5 text-ink-charcoal" />
              </div>
              <div className="px-4 py-2 rounded border-2 border-ink-charcoal bg-pure-white rounded-tl-none shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-ink-charcoal" />
                <span className="text-label-md">Thinking…</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {renderPipelineBanner()}

      {showUpload && !isFileProcessing && (
        <div className="px-4 pt-3 pb-0 bg-canvas-cream border-t-2 border-ink-charcoal">
          <AgentFileUpload
            onFileSelect={handleFileSelect}
            selectedFile={null}
            onClear={() => {}}
          />
        </div>
      )}

      <div className="p-4 bg-pure-white border-t-2 border-ink-charcoal">
        {isFileProcessing && (
          <div className="flex items-center gap-2 mb-2 text-label-sm font-medium text-ink-charcoal/70">
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>Please wait while your document is being processed…</span>
          </div>
        )}
        <AgentChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          onAttachClick={() => setShowUpload((v) => !v)}
          disabled={isDisabled}
          isSending={isGenerating || isFileProcessing}
        />
      </div>
    </div>
  );
}
