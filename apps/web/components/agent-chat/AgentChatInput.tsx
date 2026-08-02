"use client";

import React, { useRef } from "react";
import { Send, Paperclip } from "lucide-react";

interface AgentChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onAttachClick: () => void;
  disabled?: boolean;
  /** Shows a spinner-like pulse on send when true */
  isSending?: boolean;
}

export default function AgentChatInput({
  value,
  onChange,
  onSend,
  onAttachClick,
  disabled = false,
  isSending = false,
}: AgentChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    // Auto-resize textarea
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="flex gap-2 items-end">
      {/* Attach button */}
      <button
        type="button"
        onClick={onAttachClick}
        disabled={disabled}
        className="p-2 bg-surface-container-low border-2 border-ink-charcoal rounded hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center h-[42px] shrink-0"
        aria-label="Attach file"
        title="Attach file"
      >
        <Paperclip className="w-5 h-5 text-ink-charcoal" />
      </button>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask the quiz agent anything…"
        rows={1}
        className="flex-1 bg-surface-container-low border-2 border-ink-charcoal rounded px-3 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-electric-sun focus:border-ink-charcoal transition-all placeholder:text-ink-charcoal/50 min-h-[42px] resize-none custom-scrollbar"
        aria-label="Chat message input"
      />

      {/* Send button */}
      <button
        type="button"
        onClick={onSend}
        disabled={disabled || isSending || value.trim() === ""}
        className="p-2 bg-electric-sun border-2 border-ink-charcoal rounded shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] transition-all flex items-center justify-center h-[42px] shrink-0"
        aria-label="Send message"
        title="Send (Enter)"
      >
        <Send
          className={`w-5 h-5 text-ink-charcoal ${isSending ? "animate-pulse" : ""}`}
        />
      </button>
    </div>
  );
}
