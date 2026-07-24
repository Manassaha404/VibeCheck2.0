import React from "react";
import { Bot, Minimize2, X, MessageSquarePlus } from "lucide-react";

interface AgentChatHeaderProps {
  onMinimize: () => void;
  onClose: () => void;
  onNewConversation?: () => void;
}

export default function AgentChatHeader({ onMinimize, onClose, onNewConversation }: AgentChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-electric-sun border-b-2 border-ink-charcoal shrink-0">
      {/* Left — avatar + title */}
      <div className="flex items-center gap-2">
        <Bot className="w-6 h-6 text-ink-charcoal" />
        <h3 className="font-headline-sm text-headline-sm font-bold tracking-tight uppercase text-ink-charcoal m-0">
          Quiz Maker Agent
        </h3>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1">
        {onNewConversation && (
          <button
            type="button"
            onClick={onNewConversation}
            className="p-1 hover:bg-pure-white border-2 border-transparent hover:border-ink-charcoal rounded transition-colors text-ink-charcoal"
            aria-label="New Conversation"
            title="New Conversation"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        )}
        <button
          type="button"
          onClick={onMinimize}
          className="p-1 hover:bg-pure-white border-2 border-transparent hover:border-ink-charcoal rounded transition-colors text-ink-charcoal"
          aria-label="Minimize panel"
          title="Minimize"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-pure-white border-2 border-transparent hover:border-ink-charcoal rounded transition-colors text-ink-charcoal"
          aria-label="Close panel"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
