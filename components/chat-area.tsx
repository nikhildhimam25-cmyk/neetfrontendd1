"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCQCard } from "./mcq-card";

export interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  mcq?: {
    metadata: string;
    question: string;
    options: { letter: string; text: string }[];
    correctAnswer: string;
    explanation: string;
  };
}

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isAI = message.role === "ai";

  return (
    <div className={cn("flex gap-3", isAI ? "justify-start" : "justify-end")}>
      {isAI && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}

      <div className={cn("flex max-w-[85%] flex-col gap-3 md:max-w-[75%]", !isAI && "items-end")}>
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-4 py-3 text-sm leading-relaxed",
              isAI
                ? "rounded-tl-md bg-secondary text-foreground"
                : "rounded-tr-md bg-primary text-primary-foreground"
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        )}

        {message.mcq && (
          <MCQCard
            metadata={message.mcq.metadata}
            question={message.mcq.question}
            options={message.mcq.options}
            correctAnswer={message.mcq.correctAnswer}
            explanation={message.mcq.explanation}
          />
        )}
      </div>

      {!isAI && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}

interface ChatAreaProps {
  messages: ChatMessage[];
}

export function ChatArea({ messages }: ChatAreaProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
