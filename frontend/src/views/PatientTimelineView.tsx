import { ChevronLeft, Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLogsByPatient, getPatientById } from "../api/client";
import type { LogRecord, Patient } from "../api/types";
import StructuredLogCard from "../components/StructuredLogCard";
import { useAppState } from "../state/AppStateContext";

export default function PatientTimelineView() {
  const navigate = useNavigate();
  const { selectedPatient } = useAppState();

  const [patient, setPatient] = useState<Patient | null>(selectedPatient);
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPatient) {
      setPatient(null);
      setLogs([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getPatientById(selectedPatient.id),
      getLogsByPatient(selectedPatient.id),
    ])
      .then(([patientData, logsData]) => {
        if (cancelled) return;
        setPatient(patientData);
        setLogs(logsData.logs);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to fetch patient timeline.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedPatient]);

  if (!selectedPatient) {
    return (
      <div className="screen-wrapper text-[var(--text-primary)] bg-[var(--surface-bg)]">
        <header className="screen-header">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="h-10 w-10 rounded-full border border-[var(--border-subtle)] bg-white grid place-items-center text-[var(--text-primary)] shadow-sm transition-transform hover:scale-[1.02]"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="flex-1 pl-3">
            <h1 className="screen-title text-[var(--text-primary)] tracking-tight">Patient Care Timeline</h1>
            <p className="screen-subtitle text-[var(--text-muted)]">Select patient from dashboard</p>
          </div>
        </header>
        <section className="glass-panel p-5">
          <p className="text-[14px] font-medium text-[var(--text-muted)]">
            No patient selected. Pick one from the dashboard to view timeline logs.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="screen-wrapper text-[var(--text-primary)] bg-[var(--surface-bg)]">
      <header className="screen-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full border border-[var(--border-subtle)] bg-white grid place-items-center text-[var(--text-primary)] shadow-sm transition-transform hover:scale-[1.02]"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <div className="flex-1 pl-3">
          <h1 className="screen-title text-[var(--text-primary)] tracking-tight">Patient Care Timeline</h1>
          <p className="screen-subtitle text-[var(--text-muted)]">{patient?.ward ?? selectedPatient.ward}</p>
        </div>
      </header>

      <section className="glass-panel overflow-hidden border-0">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight drop-shadow-sm">{patient?.name ?? selectedPatient.name}</h2>
          <p className="mt-2 text-[13px] font-bold text-[var(--text-muted)]">ID #{selectedPatient.id} • {patient?.ward ?? selectedPatient.ward}</p>
        </div>
      </section>

      <section className="mt-2 flex justify-end px-2">
        <button
          type="button"
          onClick={() => navigate("/voice-log")}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <Mic size={16} strokeWidth={2.4} />
          Record New Log
        </button>
      </section>

      {loading && (
        <section className="mt-5 glass-panel p-5 text-[14px] font-medium text-[var(--text-muted)]">Loading logs...</section>
      )}

      {error && <section className="mt-5 glass-panel p-5 text-[14px] font-bold text-rose-600">{error}</section>}

      {!loading && !error && logs.length === 0 && (
        <section className="mt-5 glass-panel p-5 text-[14px] font-medium text-[var(--text-muted)]">
          No logs found for this patient yet.
        </section>
      )}

      <section className="mt-5 space-y-4 pb-3">
        {logs.map((log) => (
          <article key={log.id} className="space-y-3">
            <div className="glass-panel p-5 border border-[var(--border-subtle)] shadow-sm hover:-translate-y-1 transition-transform">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {new Date(log.created_at).toLocaleString()}
                </p>
                <span className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] bg-white border shadow-sm" style={{ color: "var(--primary)", borderColor: "var(--border-subtle)" }}>
                  {Math.round(log.confidence * 100)}% confidence
                </span>
              </div>
              <p className="text-[14px] leading-relaxed text-[var(--text-primary)] font-medium">{log.raw_text}</p>
            </div>
            <StructuredLogCard
              structured={log.structured_log}
              needsReview={log.needs_review}
            />
          </article>
        ))}
      </section>
    </div>
  );
}
