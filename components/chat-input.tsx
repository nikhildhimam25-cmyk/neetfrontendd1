"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border bg-gradient-to-t from-background via-background to-transparent p-4">
      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div
            className={cn(
              "flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-2xl transition-all duration-200",
              "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
            )}
          >
            {/* Attachment Button */}
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about NEET Physics, Chemistry, or Biology..."
              rows={1}
              className="max-h-[150px] min-h-[40px] flex-1 resize-none border-0 bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
              disabled={isLoading}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                message.trim() && !isLoading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "cursor-not-allowed bg-secondary text-muted-foreground"
              )}
              aria-label="Send message"
            >
              <Send className={cn("h-5 w-5", isLoading && "animate-pulse")} />
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
}
