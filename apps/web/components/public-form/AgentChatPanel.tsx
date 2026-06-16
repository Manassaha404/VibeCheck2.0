import React from "react";
import { Send, Bot, User, RotateCcw } from "lucide-react";
import { useAgentChat } from "../../hook/form/useAgentChat";

interface AgentChatPanelProps {
  formId: string;
  formTitle: string;
  totalFields: number;
  collectedCount: number;
  onComplete: (responseId?: string) => void;
  onClear: () => void;
}

export function AgentChatPanel({
  formId,
  formTitle,
  totalFields,
  collectedCount,
  onComplete,
  onClear,
}: AgentChatPanelProps) {
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
  } = useAgentChat(formId, formTitle, onComplete, onClear);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const progress = totalFields > 0 ? Math.round((collectedCount / totalFields) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[var(--color-canvas-cream)] border-[3px] border-[var(--color-ink-charcoal)] shadow-hard-sm overflow-hidden flex-1">
      {/* Agent Header / Progress */}
      <div className="bg-[var(--color-electric-sun)] border-b-[3px] border-[var(--color-ink-charcoal)] px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border-[3px] border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard-sm">
            <Bot size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-label-md font-bold">AI Form Guide</p>
            <p className="text-[11px] opacity-80 font-bold">Powered by GPT-4o mini</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold text-[var(--color-ink-charcoal)] uppercase tracking-wider">
            {collectedCount}/{totalFields} Completed
          </span>
          <div className="w-24 h-2.5 bg-white rounded-full border-2 border-[var(--color-ink-charcoal)] overflow-hidden shadow-hard-sm">
            <div
              className="h-full bg-[var(--color-leaf-green)] rounded-full transition-all duration-700 ease-out border-r-2 border-[var(--color-ink-charcoal)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar bg-[var(--color-canvas-cream)]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-fade-up ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-10 h-10 flex-shrink-0 rounded-full border-[3px] border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard-sm ${
                msg.role === "agent"
                  ? "bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)]"
                  : "bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)]"
              }`}
            >
              {msg.role === "agent" ? (
                <Bot size={20} strokeWidth={2.5} />
              ) : (
                <User size={20} strokeWidth={2.5} />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] px-5 py-3 rounded-2xl border-[3px] border-[var(--color-ink-charcoal)] shadow-hard-sm text-body-lg font-bold leading-relaxed ${
                msg.role === "agent"
                  ? "bg-white rounded-tl-sm"
                  : "bg-[var(--color-leaf-green)] rounded-tr-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <p className="text-[11px] opacity-60 mt-2 text-right font-bold">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 animate-fade-up">
            <div className="w-10 h-10 flex-shrink-0 rounded-full border-[3px] border-[var(--color-ink-charcoal)] flex items-center justify-center bg-[var(--color-electric-sun)] shadow-hard-sm">
              <Bot size={20} strokeWidth={2.5} />
            </div>
            <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border-[3px] border-[var(--color-ink-charcoal)] shadow-hard-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[var(--color-ink-charcoal)] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2.5 h-2.5 bg-[var(--color-ink-charcoal)] rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2.5 h-2.5 bg-[var(--color-ink-charcoal)] rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t-[3px] border-[var(--color-ink-charcoal)] p-4 bg-white z-10">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer… (Enter to send)"
            rows={1}
            disabled={isTyping}
            className="flex-1 resize-none border-[3px] border-[var(--color-ink-charcoal)] rounded-xl px-4 py-3 text-body-lg font-bold bg-white outline-none focus:border-[var(--color-electric-sun)] focus:shadow-[0_0_0_4px_var(--color-electric-sun),4px_4px_0px_0px_var(--color-ink-charcoal)] shadow-hard-sm transition-all disabled:opacity-50 min-h-[52px] max-h-32 custom-scrollbar"
            style={{ fieldSizing: "content" } as any}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            id="agent-send-btn"
            className="w-14 h-[52px] flex-shrink-0 bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)] rounded-xl border-[3px] border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard btn-press disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-hard-sm hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-none transition-all"
          >
            <Send size={24} strokeWidth={2.5} />
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
