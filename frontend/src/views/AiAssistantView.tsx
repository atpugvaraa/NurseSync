import { ArrowUp, Bot, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { chatWithAgent } from "../api/client";
import { useAppState } from "../state/AppStateContext";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function AIAssistantView() {
  const { selectedPatient } = useAppState();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "NurseSync AI is ready. Ask for summaries, risk checks, or handoff-safe notes.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversationHistory = useMemo(
    () => messages.map((msg) => ({ role: msg.role, content: msg.content })),
    [messages],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: question }];
    setMessages(nextMessages);
    setDraft("");
    setLoading(true);
    setError(null);

    try {
      const response = await chatWithAgent({
        message: question,
        patient_id: selectedPatient?.id ?? null,
        conversation_history: conversationHistory,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: response.reply }]);
    } catch {
      setError("Failed to reach AI assistant.");
      setMessages(nextMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-wrapper text-[var(--text-primary)] bg-[var(--surface-bg)]">
      <header className="screen-header">
        <div>
          <h1 className="screen-title text-[var(--text-primary)]">NurseSync AI</h1>
          <p className="screen-subtitle text-[var(--text-muted)]">
            {selectedPatient
              ? `${selectedPatient.name} • ${selectedPatient.ward}`
              : "No patient selected"}
          </p>
        </div>
        <div className="h-11 w-11 rounded-full border border-[var(--border-subtle)] bg-white grid place-items-center text-[var(--primary)] shadow-sm">
          <Bot size={20} strokeWidth={2.4} />
        </div>
      </header>

      <section className="glass-panel p-5">
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Conversation</p>
        <div className="mt-3 flex max-h-[420px] flex-col gap-3 overflow-y-auto">
          {messages.map((message, index) => {
            const isAssistant = message.role === "assistant";
            return (
              <article
                key={`msg-${index}`}
                className={
                  isAssistant
                    ? "rounded-2xl border p-4 text-[var(--text-primary)] shadow-sm backdrop-blur-md"
                    : "ml-8 rounded-2xl border p-4 bg-white text-[var(--text-primary)] shadow-md"
                }
                style={
                  isAssistant
                    ? { backgroundColor: "var(--bg-glass)", borderColor: "var(--border-subtle)" }
                    : { borderColor: "var(--border-subtle)" }
                }
              >
                <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {isAssistant ? <Bot size={14} className="text-[var(--primary)]" /> : <UserRound size={14} className="text-[var(--primary-contrast)]" />}
                  {isAssistant ? "Assistant" : "You"}
                </p>
                <p className="text-[14px] leading-relaxed font-medium">{message.content}</p>
              </article>
            );
          })}
        </div>

        {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}

        <form onSubmit={(event) => void handleSubmit(event)} className="mt-5 flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={2}
            placeholder="Ask NurseSync AI..."
            className="min-h-[56px] flex-1 resize-none rounded-[20px] border px-4 py-3 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors shadow-sm backdrop-blur-md"
            style={{ backgroundColor: "var(--bg-glass)", borderColor: "var(--border-subtle)" }}
          />
          <button
            type="submit"
            disabled={loading || draft.trim().length === 0}
            className="h-12 w-12 rounded-full text-white grid place-items-center disabled:opacity-50 transition-transform hover:scale-[1.02] shadow-sm hover:shadow-md"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <ArrowUp size={18} strokeWidth={2.8} />
          </button>
        </form>

        {loading && <p className="mt-2 text-xs font-semibold text-[var(--text-muted)]">Assistant is thinking...</p>}
      </section>
    </div>
  );
}
