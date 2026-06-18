"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar, TopBar, Subject } from "@/components/sidebar";
import { ChatArea, ChatMessage } from "@/components/chat-area";
import { ChatInput } from "@/components/chat-input";

const API_BASE = "https://nikhu28-neet.hf.space";

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Hello, Aarav! 👋 Welcome back to your NEET preparation journey. I'm your AI tutor, ready to help you master Physics, Chemistry, and Biology.\n\nI can explain complex concepts, solve problems step-by-step, provide PYQ practice, and test your understanding with interactive MCQs. What would you like to work on today?",
  },
  {
    id: "2",
    role: "user",
    content: "Can you give me an MCQ practice question from Physics - Mechanics? I want to practice some PYQs.",
  },
  {
    id: "3",
    role: "ai",
    content: "Great choice! Mechanics is a crucial topic for NEET. Here's a Previous Year Question for you:",
    mcq: {
      metadata: "Physics • Mechanics • PYQ 2023",
      question:
        "A ball is thrown vertically upward with a velocity of 20 m/s from the top of a building. The height of the building is 25 m. How long will it take for the ball to hit the ground? (Take g = 10 m/s²)",
      options: [
        { letter: "A", text: "5 seconds" },
        { letter: "B", text: "4 seconds" },
        { letter: "C", text: "3 seconds" },
        { letter: "D", text: "2.5 seconds" },
      ],
      correctAnswer: "A",
      explanation:
        "Using the equation s = ut + ½gt², where s = -25m (downward), u = 20 m/s (upward), and g = 10 m/s². We get -25 = 20t - 5t², which gives us t² - 4t - 5 = 0. Solving this quadratic equation: t = 5s (taking positive value).",
    },
  },
];

// Parse AI response text — detect MCQ JSON blocks if API returns them
function parseAIResponse(raw: string): { content: string; mcq?: ChatMessage["mcq"] } {
  // Try to detect JSON MCQ block wrapped in ```json ... ```
  const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.question && parsed.options) {
        return {
          content: raw.replace(/```json[\s\S]*?```/, "").trim(),
          mcq: {
            metadata: parsed.metadata || "NEET Practice Question",
            question: parsed.question,
            options: parsed.options,
            correctAnswer: parsed.correct_answer || parsed.correctAnswer || "A",
            explanation: parsed.explanation || "",
          },
        };
      }
    } catch (_) {}
  }
  return { content: raw };
}

export default function NEETTutorPage() {
  const [activeSubject, setActiveSubject] = useState<Subject>("physics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Add a loading placeholder
    const loadingId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: loadingId, role: "ai", content: "..." },
    ]);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          subject: activeSubject,
          // include conversation history (last 6 messages for context)
          history: messages.slice(-6).map((m) => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response shapes from the API
      const rawText: string =
        data.response ||
        data.answer ||
        data.message ||
        data.content ||
        JSON.stringify(data);

      const { content: aiContent, mcq } = parseAIResponse(rawText);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { id: loadingId, role: "ai", content: aiContent, mcq }
            : m
        )
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error && err.message.includes("API error")
          ? `Something went wrong on the server. Please try again.`
          : `Can't reach the API right now. Make sure the HuggingFace Space is running at ${API_BASE}`;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { id: loadingId, role: "ai", content: errorMsg }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activeSubject={activeSubject}
        onSubjectChange={setActiveSubject}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          activeSubject={activeSubject}
          onSubjectChange={setActiveSubject}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <ChatArea messages={messages} />
          <div ref={chatEndRef} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
