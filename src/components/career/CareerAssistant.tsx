"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { careerAssistant } from "@/actions/career-assistant";
import type {
  ChatMessage,
  CareerAssistantResult,
  AssistantSuggestedAction,
  CareerContextHint,
} from "@/actions/types";

const SUGGESTED_PROMPTS = [
  "What jobs should I target?",
  "Review my current job search strategy",
  "Which of my saved jobs is the best fit?",
  "Help me improve my resume",
  "Prepare me for an interview",
  "Help me write a follow-up message",
  "What skills should I strengthen?",
  "Help me negotiate an offer",
];

interface ConversationMessage extends ChatMessage {
  actions?: AssistantSuggestedAction[];
  referencedJobIds?: string[];
  referencedResumeIds?: string[];
  isLoading?: boolean;
  error?: boolean;
}

const DISCLAIMER =
  "Career AI can help you evaluate opportunities and prepare career materials. Always review AI-generated information before submitting it to an employer.";

export function CareerAssistant() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [contextHint, setContextHint] = useState<CareerContextHint>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      setIsSending(true);
      setInput("");

      const userMsg: ConversationMessage = { role: "user", content: trimmed };
      const loadingMsg: ConversationMessage = {
        role: "assistant",
        content: "",
        isLoading: true,
      };
      const history: ChatMessage[] = messages
        .filter((m) => !m.isLoading && !m.error)
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, userMsg, loadingMsg]);

      try {
        const result: CareerAssistantResult = await careerAssistant(
          trimmed,
          history,
          contextHint
        );

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: result.response ?? "",
            actions: result.suggested_actions,
            referencedJobIds: result.referenced_job_ids,
            referencedResumeIds: result.referenced_resume_ids,
            error: !!result.error,
            isLoading: false,
          };
          return updated;
        });

        if (result.error) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].content = result.error!;
            return updated;
          });
        }
      } catch {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Something went wrong. Please try again.",
            error: true,
            isLoading: false,
          };
          return updated;
        });
      } finally {
        setIsSending(false);
        inputRef.current?.focus();
      }
    },
    [isSending, messages, contextHint]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setContextHint({});
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col md:h-[calc(100vh-9rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-career-navy">Career Assistant</h1>
          <p className="mt-1 text-sm text-career-slate">
            Your personal AI career strategist — powered by your Career AI data.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearConversation}
            disabled={!hasMessages}
            className="rounded-lg border border-career-border bg-white px-3 py-2 text-sm font-medium text-career-slate transition hover:bg-career-surface disabled:opacity-40"
          >
            New Conversation
          </button>
        </div>
      </div>

      {/* Chat scroll area */}
      <div
        ref={scrollRef}
        className="mt-4 flex-1 overflow-y-auto rounded-2xl border border-career-border bg-white p-4 shadow-sm sm:p-6"
      >
        {!hasMessages ? (
          <WelcomeScreen onPromptClick={sendMessage} />
        ) : (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="mt-3">
        {/* Disclaimer */}
        <p className="mb-2 px-1 text-xs text-career-slate/70">{DISCLAIMER}</p>
        <div className="flex items-end gap-2 rounded-2xl border border-career-border bg-white p-2 shadow-sm">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your career strategist anything…"
            rows={1}
            className="flex-1 resize-none rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm text-career-navy placeholder:text-career-slate/50 focus:outline-none"
            style={{ maxHeight: "120px" }}
            disabled={isSending}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isSending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-career-blue text-white transition hover:bg-career-blue-dark disabled:opacity-40"
            aria-label="Send message"
          >
            {isSending ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
            ) : (
              <SendIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Welcome screen with suggested prompts
// ---------------------------------------------------------------------------

function WelcomeScreen({ onPromptClick }: { onPromptClick: (prompt: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-career-blue/10 text-career-blue">
        <SparkIcon className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-career-navy">
        How can I help with your career today?
      </h2>
      <p className="mt-1.5 max-w-md text-sm text-career-slate">
        I can analyze your profile, resumes, job applications, and interview history
        to give you personalized, strategic advice.
      </p>
      <div className="mt-8 grid w-full max-w-2xl gap-2.5 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="rounded-xl border border-career-border bg-career-surface px-4 py-3 text-left text-sm font-medium text-career-navy transition hover:border-career-blue hover:bg-blue-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Message bubble
// ---------------------------------------------------------------------------

function MessageBubble({ message }: { message: ConversationMessage }) {
  const isUser = message.role === "user";

  if (message.isLoading) {
    return (
      <div className="flex justify-start">
        <div className="flex max-w-[80%] items-center gap-2 rounded-2xl rounded-tl-sm bg-career-surface px-4 py-3">
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-career-slate [animation-delay:-0.3s]" />
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-career-slate [animation-delay:-0.15s]" />
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-career-slate" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%]">
        {!isUser && (
          <div className="mb-1 flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-career-blue text-xs font-bold text-white">
              AI
            </span>
            <span className="text-xs font-medium text-career-slate">Career Strategist</span>
          </div>
        )}
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-career-blue text-white"
              : message.error
                ? "rounded-tl-sm border border-red-200 bg-red-50 text-red-700"
                : "rounded-tl-sm bg-career-surface text-career-navy"
          }`}
        >
          {message.content}
        </div>
        {!isUser && message.actions && message.actions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.actions.map((action, i) => (
              <ActionCard key={i} action={action} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Action card
// ---------------------------------------------------------------------------

const ACTION_ICONS: Record<string, string> = {
  open_job: "🔗",
  tailor_resume: "✏️",
  generate_cover_letter: "📄",
  start_interview_prep: "🎤",
  save_document: "💾",
  update_career_profile: "👤",
};

const ACTION_ROUTES: Record<string, (a: AssistantSuggestedAction) => string> = {
  open_job: (a) => (a.job_id ? `/app/job-tracker` : "/app/job-tracker"),
  tailor_resume: () => "/app/resume-ai",
  generate_cover_letter: () => "/app/resume-ai",
  start_interview_prep: () => "/app/interview-prep",
  save_document: () => "/app/resume-ai",
  update_career_profile: () => "/app/career-profile",
};

function ActionCard({ action }: { action: AssistantSuggestedAction }) {
  const icon = ACTION_ICONS[action.type] ?? "→";
  const route = ACTION_ROUTES[action.type]?.(action) ?? "/app/dashboard";

  return (
    <a
      href={route}
      className="inline-flex items-center gap-2 rounded-lg border border-career-border bg-white px-3 py-2 text-sm font-medium text-career-navy shadow-sm transition hover:border-career-blue hover:bg-blue-50"
    >
      <span>{icon}</span>
      {action.label}
    </a>
  );
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function SendIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 11 21 3 13 21l-2-8-8-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}
