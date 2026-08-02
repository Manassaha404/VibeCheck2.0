import React from "react";
import { Bot, User, Paperclip } from "lucide-react";

export type MessageRole = "user" | "agent";

export interface AgentMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  /** Optional attached file name */
  fileName?: string;
}

interface AgentMessageBubbleProps {
  message: AgentMessage;
}

export default function AgentMessageBubble({
  message,
}: AgentMessageBubbleProps) {
  const isAgent = message.role === "agent";

  return (
    <div className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
      <div
        className={`flex gap-3 max-w-[85%] ${
          !isAgent ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded border-2 border-ink-charcoal flex items-center justify-center ${!isAgent ? "bg-mint" : "bg-lavender"}`}
        >
          {!isAgent ? (
            <User className="w-5 h-5 text-ink-charcoal" />
          ) : (
            <Bot className="w-5 h-5 text-ink-charcoal" />
          )}
        </div>
        <div
          className={`flex flex-col gap-1 min-w-0 px-4 py-2 rounded border-2 border-ink-charcoal ${
            !isAgent
              ? "bg-pure-white rounded-tr-none"
              : "bg-pure-white rounded-tl-none"
          } shadow-[2px_2px_0px_0px_rgba(44,46,42,1)]`}
        >
          {message.content && (
            <p className="text-label-md leading-relaxed whitespace-pre-wrap text-ink-charcoal m-0 break-words">
              {message.content}
            </p>
          )}

          {/* Attached file chip */}
          {message.fileName && (
            <div className="flex items-center gap-1.5 px-2 py-1 mt-1 rounded border-2 border-ink-charcoal bg-surface-container-low text-label-sm font-medium min-w-0 max-w-full">
              <Paperclip className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate min-w-0">{message.fileName}</span>
            </div>
          )}

          {/* Timestamp */}
          <span className="text-[10px] opacity-60 font-medium text-ink-charcoal self-end mt-1">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
