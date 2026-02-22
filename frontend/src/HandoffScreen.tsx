import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  RefreshCcw,
  Send,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  acceptIncomingHandoff,
  endShift,
  getIncomingHandoff,
} from "./api/client";
import { isPendingHandoff } from "./api/mappers";
import type { AppOutletContext } from "./App";
import type { HandoffEndResponse, HandoffRecord } from "./api/types";
import { useAppState } from "./state/AppStateContext";

export default function HandoffScreen() {
  const navigate = useNavigate();
  const { shiftId, nurseId, setShiftId } = useOutletContext<AppOutletContext>();
  const { selectedPatient, tasks, toggleTask, latestVoiceLog } = useAppState();

  const [incomingHandoff, setIncomingHandoff] = useState<HandoffRecord | null>(null);
  const [outgoingSummary, setOutgoingSummary] = useState<HandoffEndResponse | null>(null);
  const [loadingIncoming, setLoadingIncoming] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const taskPreview = useMemo(() => tasks.slice(0, 3), [tasks]);

  const loadIncoming = async () => {
    setLoadingIncoming(true);
    setError(null);

    try {
      const response = await getIncomingHandoff();
      if (isPendingHandoff(response)) {
        setIncomingHandoff(response);
      } else {
        setIncomingHandoff(null);
      }
    } catch {
      setError("Failed to load incoming handoff.");
    } finally {
      setLoadingIncoming(false);
    }
  };

  useEffect(() => {
    void loadIncoming();
  }, []);

  const handleAcceptIncoming = async () => {
    if (!incomingHandoff) return;

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await acceptIncomingHandoff({
        handoff_id: incomingHandoff.id,
        incoming_nurse_id: nurseId,
      });

      setShiftId(response.shift_id);
      setSuccessMsg(response.message);
      setIncomingHandoff(null);
    } catch {
      setError("Failed to accept handoff.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateOutgoing = async () => {
    if (!shiftId) {
      setError("No active shift found yet. Please wait for shift initialization.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await endShift({ nurse_id: nurseId, shift_id: shiftId });

      if ("error" in response) {
        setError(response.error);
        return;
      }

      setOutgoingSummary(response);
      setSuccessMsg("Handoff summary generated successfully.");
    } catch {
      setError("Failed to generate outgoing handoff.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen-wrapper text-[var(--text-primary)] bg-[var(--surface-bg)]">
      <header className="screen-header sticky top-0 z-10 py-1" style={{ backdropFilter: "blur(10px)" }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full border border-[var(--border-subtle)] bg-white grid place-items-center text-[var(--text-primary)] shadow-sm transition-transform hover:scale-[1.02]"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">Shift Handoff Summary</h1>
        <button
          type="button"
          onClick={() => void loadIncoming()}
          className="h-10 w-10 rounded-full border border-[var(--border-subtle)] bg-white grid place-items-center text-[var(--text-primary)] shadow-sm transition-transform hover:scale-[1.02]"
          aria-label="Refresh incoming handoff"
        >
          <RefreshCcw size={18} strokeWidth={2.4} />
        </button>
      </header>

      <main className="flex flex-col gap-4 pb-6">
        {error && (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </section>
        )}

        {successMsg && (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {successMsg}
          </section>
        )}

        <section className="glass-panel p-5">
          <p className="section-title border-b-0">Current Patient Context</p>
          {selectedPatient ? (
            <>
              <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)] tracking-tight">{selectedPatient.name}</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)] font-medium">{selectedPatient.ward}</p>
            </>
          ) : (
            <p className="mt-3 text-sm font-semibold text-[var(--text-muted)]">No patient selected from dashboard.</p>
          )}
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-soft)]">Shift ID: {shiftId || "Not started"}</p>
        </section>

        <section className="glass-panel p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={14} strokeWidth={2.5} style={{ color: "var(--primary-contrast)" }} />
            <p className="text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: "var(--primary-contrast)" }}>Incoming Handoff</p>
          </div>

          {loadingIncoming ? (
            <p className="text-sm font-medium text-[var(--text-muted)]">Loading incoming handoff...</p>
          ) : incomingHandoff ? (
            <>
              <p className="text-sm leading-relaxed text-[var(--text-primary)]">{incomingHandoff.summary_text}</p>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-bg)] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">Pending Tasks</p>
                  {incomingHandoff.pending_tasks.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-primary)] font-medium">
                      {incomingHandoff.pending_tasks.map((task) => (
                        <li key={task}>• {task}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-[var(--text-muted)]">No pending tasks.</p>
                  )}
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-rose-600">High Priority</p>
                  {incomingHandoff.high_priority.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm text-rose-700 font-medium">
                      {incomingHandoff.high_priority.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-rose-500">No high-priority items.</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleAcceptIncoming()}
                disabled={submitting}
                className="mt-4 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: "var(--primary)" }}
              >
                Accept Handoff
              </button>
            </>
          ) : (
            <p className="text-sm font-medium text-[var(--text-muted)]">No pending incoming handoff.</p>
          )}
        </section>

        <section className="glass-panel p-5">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardList size={14} strokeWidth={2.5} style={{ color: "var(--primary)" }} />
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Handoff Tasks</p>
          </div>

          <div className="space-y-3">
            {taskPreview.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleTask(task.id)}
                className="flex w-full items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-white px-3 py-3 text-left transition-colors hover:bg-[var(--surface-bg)]"
              >
                <span className="text-sm font-bold text-[var(--text-primary)]" style={{ opacity: task.completed ? 0.5 : 1 }}>
                  {task.title}
                </span>
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: task.completed ? "var(--surface-bg)" : "var(--badge-bg)",
                    color: task.completed ? "var(--text-muted)" : "var(--badge-text)",
                    border: task.completed ? "1px solid var(--border-subtle)" : "1px solid transparent"
                  }}
                >
                  {task.completed ? "Done" : "Open"}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="glass-panel p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Latest Voice Confidence</p>
          <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
            {latestVoiceLog
              ? `Most recent voice log confidence: ${(latestVoiceLog.confidence * 100).toFixed(1)}%`
              : "No saved voice log yet."}
          </p>
        </section>

        {outgoingSummary && (
          <section className="glass-panel p-5">
            <div className="flex items-center gap-2" style={{ color: "var(--primary-contrast)" }}>
              <CheckCircle2 size={16} strokeWidth={2.4} />
              <p className="text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: "var(--primary-contrast)", marginBottom: 0 }}>Generated Outgoing Summary</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-primary)] font-medium">{outgoingSummary.summary}</p>
            <div className="mt-4 grid grid-cols-1 gap-2">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-bg)] p-3 text-sm font-bold text-[var(--text-muted)]">
                Pending Tasks: {outgoingSummary.pending_tasks.length}
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">
                High Priority Items: {outgoingSummary.high_priority.length}
              </div>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/discharge-summary")}
            className="flex items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] bg-white px-5 py-3.5 text-sm font-bold text-[var(--text-primary)] transition-all hover:bg-gray-50 shadow-sm hover:scale-[1.02] hover:shadow-md"
          >
            <AlertCircle size={16} strokeWidth={2.5} />
            Edit Summary
          </button>
          <button
            type="button"
            onClick={() => void handleGenerateOutgoing()}
            disabled={submitting || !shiftId}
            className="flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold text-white transition-all disabled:opacity-50 shadow-sm hover:scale-[1.02] hover:shadow-md"
            style={{ backgroundColor: "var(--primary-contrast)" }}
          >
            <Send size={16} strokeWidth={2.5} />
            Send Handoff
          </button>
        </section>
      </main>
    </div>
  );
}
