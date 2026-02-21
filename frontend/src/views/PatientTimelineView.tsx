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
      <div className="screen-wrapper" style={{ background: "#dce8e6" }}>
        <header className="screen-header">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="h-10 w-10 rounded-md border border-slate-300 bg-white grid place-items-center text-slate-700"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="flex-1 pl-3">
            <h1 className="screen-title">Patient Care Timeline</h1>
            <p className="screen-subtitle">Select patient from dashboard</p>
          </div>
        </header>
        <section className="card p-5">
          <p className="text-sm text-slate-600">
            No patient selected. Pick one from the dashboard to view timeline logs.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="screen-wrapper" style={{ background: "#dce8e6" }}>
      <header className="screen-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-md border border-slate-300 bg-white grid place-items-center text-slate-700"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <div className="flex-1 pl-3">
          <h1 className="screen-title">Patient Care Timeline</h1>
          <p className="screen-subtitle">{patient?.ward ?? selectedPatient.ward}</p>
        </div>
      </header>

      <section className="card overflow-hidden">
        <div className="h-[180px] bg-gradient-to-br from-teal-700 to-cyan-900" />
        <div className="p-4">
          <h2 className="text-4xl font-black text-slate-900">{patient?.name ?? selectedPatient.name}</h2>
          <p className="mt-2 text-sm text-slate-600">ID #{selectedPatient.id} • {patient?.ward ?? selectedPatient.ward}</p>
        </div>
      </section>

      <section className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/voice-log")}
          className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white"
        >
          <Mic size={14} strokeWidth={2.4} />
          Record New Log
        </button>
      </section>

      {loading && (
        <section className="mt-4 card p-5 text-sm text-slate-500">Loading logs...</section>
      )}

      {error && <section className="mt-4 card p-5 text-sm text-rose-600">{error}</section>}

      {!loading && !error && logs.length === 0 && (
        <section className="mt-4 card p-5 text-sm text-slate-500">
          No logs found for this patient yet.
        </section>
      )}

      <section className="mt-4 space-y-3 pb-3">
        {logs.map((log) => (
          <article key={log.id} className="space-y-2">
            <div className="card p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {new Date(log.created_at).toLocaleString()}
                </p>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                  {Math.round(log.confidence * 100)}% confidence
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{log.raw_text}</p>
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
