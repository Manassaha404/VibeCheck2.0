import React, { useState, useRef, useCallback } from "react";
import { Send, Bot, User, RotateCcw, Paperclip, X, FileIcon, Loader2 } from "lucide-react";
import { useAgentChat } from "../../hook/form/useAgentChat";
import { useFileUpload } from "../../hook/form/useFileUpload";
import { useSubmitStaticForm } from "../../hook/form/useSubmitStaticForm";

interface AgentChatPanelProps {
  formId: string;
  formTitle: string;
  totalFields: number;
  collectedCount: number;
  onComplete: (responseId?: string) => void;
  onClear: () => void;
  primaryFieldId?: string;
}

export function AgentChatPanel({
  formId,
  formTitle,
  totalFields,
  collectedCount,
  onComplete,
  onClear,
  primaryFieldId,
}: AgentChatPanelProps) {
  // Hold raw File references — the browser already has the file, no copy needed
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploadingToServer, setIsUploadingToServer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, fetchPrimaryFieldValue, fetchRespondentSession } = useFileUpload();
  const submitMutation = useSubmitStaticForm();

  // ── Upload all queued files via resumable upload, then call onComplete ──────
  const handleComplete = useCallback(
    async (responseId?: string) => {
      if (pendingFiles.length === 0) {
        onComplete(responseId);
        return;
      }

      setIsUploadingToServer(true);
      try {
        const primaryFieldValue = await fetchPrimaryFieldValue(formId, primaryFieldId);
        
        const session = await fetchRespondentSession(formId);
        let newAnswers: Record<string, unknown> = {};
        for (const a of session?.collectedAnswers || []) {
          newAnswers[a.fieldId] = a.value;
        }

        let hasUpdates = false;

        // Stream files one-by-one to avoid saturating the pipe
        for (const file of pendingFiles) {
          const fileId = await uploadFile(formId, file, primaryFieldValue);
          if (fileId) {
            const fileAnswer = session?.collectedAnswers?.find((a: any) => 
              typeof a.value === "string" && a.value.includes(`[Attached file: ${file.name}]`)
            );
            if (fileAnswer) {
              newAnswers[fileAnswer.fieldId] = fileId;
              hasUpdates = true;
            }
          }
        }

        if (hasUpdates && responseId) {
          await submitMutation.mutateAsync({
            formId,
            answers: newAnswers,
            responseId,
          });
        }

        setPendingFiles([]);
      } catch (err) {
        console.error("Resumable upload failed:", err);
      } finally {
        setIsUploadingToServer(false);
        onComplete(responseId);
      }
    },
    [pendingFiles, formId, onComplete, uploadFile, primaryFieldId, fetchPrimaryFieldValue, submitMutation, fetchRespondentSession],
  );

  const {
    messages,
    input,
    setInput,
    isTyping,
    sendMessage,
    clearSession,
    isClearing,
    bottomRef,
    inputRef,
  } = useAgentChat(formId, formTitle, handleComplete, onClear);

  // ── Queue file without reading it — hold only the File reference ───────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileInputRef.current) fileInputRef.current.value = "";

    setPendingFiles((prev) => [...prev, file]);
    setInput((prev) =>
      prev ? `${prev}\n[Attached file: ${file.name}]` : `[Attached file: ${file.name}]`,
    );
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const progress = totalFields > 0 ? Math.round((collectedCount / totalFields) * 100) : 0;
  const isBusy = isUploadingToServer;

  return (
    <div className="flex flex-col h-full bg-[var(--color-canvas-cream)] border-[3px] border-[var(--color-ink-charcoal)] shadow-hard-sm overflow-hidden flex-1">
      {/* Agent Header / Progress */}
      <div className="bg-[var(--color-electric-sun)] border-b-[3px] border-[var(--color-ink-charcoal)] px-3 md:px-4 py-2 md:py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border-[2px] md:border-[3px] border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard-sm">
            <Bot className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-label-sm md:text-label-md font-bold leading-tight">AI Form Guide</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] md:text-[10px] font-bold text-[var(--color-ink-charcoal)] uppercase tracking-wider">
            {collectedCount}/{totalFields} Completed
          </span>
          <div className="w-20 md:w-24 h-2 md:h-2.5 bg-white rounded-full border-[1.5px] md:border-2 border-[var(--color-ink-charcoal)] overflow-hidden shadow-hard-sm">
            <div
              className="h-full bg-[var(--color-leaf-green)] rounded-full transition-all duration-700 ease-out border-r-2 border-[var(--color-ink-charcoal)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6 custom-scrollbar bg-[var(--color-canvas-cream)]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 md:gap-3 animate-fade-up ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full border-[2px] md:border-[3px] border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard-sm ${
                msg.role === "agent"
                  ? "bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)]"
                  : "bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)]"
              }`}
            >
              {msg.role === "agent" ? (
                <Bot className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
              ) : (
                <User className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] md:max-w-[80%] px-4 py-2.5 md:px-5 md:py-3 rounded-2xl border-[2px] md:border-[3px] border-[var(--color-ink-charcoal)] shadow-hard-sm text-body-md md:text-body-lg font-bold leading-relaxed ${
                msg.role === "agent"
                  ? "bg-white rounded-tl-sm"
                  : "bg-[var(--color-leaf-green)] rounded-tr-sm"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm md:text-base">{msg.text}</p>
              <p className="text-[10px] md:text-[11px] opacity-60 mt-1.5 md:mt-2 text-right font-bold">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing / uploading indicator */}
        {(isTyping || isUploadingToServer) && (
          <div className="flex gap-2 md:gap-3 animate-fade-up">
            <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full border-[2px] md:border-[3px] border-[var(--color-ink-charcoal)] flex items-center justify-center bg-[var(--color-electric-sun)] shadow-hard-sm">
              <Bot className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            </div>
            <div className="bg-white px-4 py-3 md:px-5 md:py-4 rounded-2xl rounded-tl-sm border-[2px] md:border-[3px] border-[var(--color-ink-charcoal)] shadow-hard-sm flex items-center gap-2">
              {isUploadingToServer ? (
                <>
                  <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" strokeWidth={2.5} />
                  <span className="text-[11px] md:text-[12px] font-bold opacity-70">Uploading...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[var(--color-ink-charcoal)] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[var(--color-ink-charcoal)] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[var(--color-ink-charcoal)] rounded-full animate-bounce [animation-delay:300ms]" />
                </>
              )}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Pending file badges */}
      {pendingFiles.length > 0 && (
        <div className="px-4 pt-2 pb-1 bg-white border-t border-[var(--color-ink-charcoal)]/20 flex flex-wrap gap-2">
          {pendingFiles.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] rounded-lg px-2.5 py-1 text-[11px] font-bold"
            >
              <FileIcon size={12} strokeWidth={2.5} />
              <span className="max-w-[120px] truncate">{f.name}</span>
              <button
                onClick={() => removeFile(i)}
                className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                aria-label={`Remove ${f.name}`}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t-[3px] border-[var(--color-ink-charcoal)] p-3 md:p-4 bg-white z-10">
        <div className="flex gap-2 md:gap-3 items-end">
          <label
            className={`w-12 h-12 md:w-14 md:h-[52px] flex-shrink-0 bg-white text-[var(--color-ink-charcoal)] rounded-xl border-[2px] md:border-[3px] border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard btn-press cursor-pointer hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-none transition-all ${isBusy ? "opacity-50 pointer-events-none" : ""}`}
          >
            <Paperclip className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={isBusy}
            />
          </label>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer…"
            rows={1}
            disabled={isTyping || isUploadingToServer}
            className="flex-1 resize-none border-[2px] md:border-[3px] border-[var(--color-ink-charcoal)] rounded-xl px-3 py-3 md:px-4 md:py-3 text-body-md md:text-body-lg font-bold bg-white outline-none focus:border-[var(--color-electric-sun)] focus:shadow-[0_0_0_4px_var(--color-electric-sun),4px_4px_0px_0px_var(--color-ink-charcoal)] shadow-hard-sm transition-all disabled:opacity-50 min-h-[48px] md:min-h-[52px] max-h-32 custom-scrollbar"
            style={{ fieldSizing: "content" } as any}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping || isUploadingToServer}
            id="agent-send-btn"
            className="w-12 h-12 md:w-14 md:h-[52px] flex-shrink-0 bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)] rounded-xl border-[2px] md:border-[3px] border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard btn-press disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-hard-sm hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-none transition-all"
          >
            <Send className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={clearSession}
            disabled={isClearing}
            id="agent-restart-btn"
            className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-ink-charcoal)] opacity-50 hover:opacity-100 transition-opacity"
          >
            <RotateCcw size={12} strokeWidth={2.5} />
            Restart Conversation
          </button>
        </div>
      </div>
    </div>
  );
}
