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
    <div className="screen-wrapper text-slate-900" style={{ background: "#eef4f5" }}>
      <header className="screen-header sticky top-0 z-10 py-1" style={{ backdropFilter: "blur(10px)" }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full bg-white grid place-items-center text-slate-600 shadow-sm"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-extrabold text-slate-900">Shift Handoff Summary</h1>
        <button
          type="button"
          onClick={() => void loadIncoming()}
          className="h-10 w-10 rounded-full bg-white grid place-items-center text-slate-600 shadow-sm"
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

        <section className="card p-5">
          <p className="section-title">Current Patient Context</p>
          {selectedPatient ? (
            <>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{selectedPatient.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{selectedPatient.ward}</p>
            </>
          ) : (
            <p className="mt-3 text-sm font-semibold text-slate-500">No patient selected from dashboard.</p>
          )}
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Shift ID: {shiftId || "Not started"}</p>
        </section>

        <section className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={14} strokeWidth={2.5} className="text-teal-600" />
            <p className="section-title text-teal-700">Incoming Handoff</p>
          </div>

          {loadingIncoming ? (
            <p className="text-sm text-slate-500">Loading incoming handoff...</p>
          ) : incomingHandoff ? (
            <>
              <p className="text-sm leading-relaxed text-slate-700">{incomingHandoff.summary_text}</p>

              <div className="mt-3 grid grid-cols-1 gap-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Pending Tasks</p>
                  {incomingHandoff.pending_tasks.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {incomingHandoff.pending_tasks.map((task) => (
                        <li key={task}>• {task}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">No pending tasks.</p>
                  )}
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-rose-600">High Priority</p>
                  {incomingHandoff.high_priority.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm text-rose-700">
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
                className="mt-4 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                Accept Handoff
              </button>
            </>
          ) : (
            <p className="text-sm text-slate-500">No pending incoming handoff.</p>
          )}
        </section>

        <section className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardList size={14} strokeWidth={2.5} className="text-teal-600" />
            <p className="section-title">Handoff Tasks</p>
          </div>

          <div className="space-y-3">
            {taskPreview.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleTask(task.id)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left"
              >
                <span className="text-sm font-semibold text-slate-800" style={{ opacity: task.completed ? 0.5 : 1 }}>
                  {task.title}
                </span>
                <span
                  className={
                    task.completed
                      ? "rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-700"
                      : "rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700"
                  }
                >
                  {task.completed ? "Done" : "Open"}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <p className="section-title">Latest Voice Confidence</p>
          <p className="mt-2 text-sm text-slate-700">
            {latestVoiceLog
              ? `Most recent voice log confidence: ${(latestVoiceLog.confidence * 100).toFixed(1)}%`
              : "No saved voice log yet."}
          </p>
        </section>

        {outgoingSummary && (
          <section className="card p-5">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={16} strokeWidth={2.4} />
              <p className="section-title text-emerald-700">Generated Outgoing Summary</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{outgoingSummary.summary}</p>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                Pending Tasks: {outgoingSummary.pending_tasks.length}
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                High Priority Items: {outgoingSummary.high_priority.length}
              </div>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/discharge-summary")}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700"
          >
            <AlertCircle size={16} strokeWidth={2.5} />
            Edit Summary
          </button>
          <button
            type="button"
            onClick={() => void handleGenerateOutgoing()}
            disabled={submitting || !shiftId}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-400 px-4 py-3 font-bold text-white disabled:opacity-50"
          >
            <Send size={16} strokeWidth={2.5} />
            Send Handoff
          </button>
        </section>
      </main>
    </div>
  );
}
