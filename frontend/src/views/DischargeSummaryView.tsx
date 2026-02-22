import { CheckCircle2, ChevronLeft, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";

export default function DischargeSummaryView() {
  const navigate = useNavigate();
  const { selectedPatient, latestVoiceLog } = useAppState();

  return (
    <div className="screen-wrapper bg-[var(--surface-bg)] text-[var(--text-primary)]">
      <header className="screen-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full border border-[var(--border-subtle)] bg-white grid place-items-center text-[var(--text-primary)] shadow-sm transition-transform hover:scale-[1.02]"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight">Discharge Summary</h1>
        <button className="h-10 w-10 rounded-full border border-[var(--border-subtle)] bg-white grid place-items-center text-[var(--primary)] shadow-sm transition-transform hover:scale-[1.02]">
          <Share2 size={18} strokeWidth={2.5} />
        </button>
      </header>

      <section className="glass-panel p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              {selectedPatient?.name ?? "No patient selected"}
            </h2>
            <p className="mt-1 text-[13px] font-bold text-[var(--text-muted)]">
              ID #{selectedPatient?.id ?? "N/A"} • {selectedPatient?.ward ?? "Unknown ward"}
            </p>
          </div>
          <span className="rounded-full px-3 py-1 text-[10px] font-bold shadow-sm whitespace-nowrap bg-white uppercase tracking-widest" style={{ color: "var(--primary)", border: "1px solid var(--border-subtle)" }}>
            Ready For Review
          </span>
        </div>
      </section>

      <section className="mt-5 space-y-3">
        <article className="glass-panel flex items-center justify-between px-5 py-4 transition-transform hover:scale-[1.01]">
          <div>
            <p className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight">Clinical Course &amp; History</p>
            <p className="text-[12px] font-bold text-[var(--text-muted)] mt-0.5">Extracted from latest voice log</p>
          </div>
          <CheckCircle2 size={20} strokeWidth={2.5} style={{ color: "var(--primary-accent)" }} />
        </article>

        <article className="glass-panel flex items-center justify-between px-5 py-4 transition-transform hover:scale-[1.01]">
          <div>
            <p className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight">Treatments &amp; Labs</p>
            <p className="text-[12px] font-bold text-[var(--text-muted)] mt-0.5">All metrics updated today</p>
          </div>
          <CheckCircle2 size={20} strokeWidth={2.5} style={{ color: "var(--primary-accent)" }} />
        </article>

        <article className="glass-panel flex items-center justify-between px-5 py-4 transition-transform hover:scale-[1.01]">
          <div>
            <p className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight">Medication Reconciliation</p>
            <p className="text-[12px] font-bold text-[var(--primary)] mt-0.5">2 pending confirmations</p>
          </div>
          <span className="rounded-full px-3 py-1 text-[10px] font-bold shadow-sm uppercase tracking-widest bg-white" style={{ color: "var(--primary-contrast)", border: "1px solid var(--border-subtle)" }}>Fix</span>
        </article>
      </section>

      <button className="mt-5 w-full rounded-full px-5 py-4 text-[15px] font-bold text-white shadow-sm transition-transform hover:scale-[1.01] hover:shadow-md" style={{ backgroundColor: "var(--primary)" }}>
        Generate AI Summary
      </button>

      <section className="glass-panel mt-5 p-5">
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Document Preview</p>
        <article className="mt-4 rounded-[20px] bg-white p-5 shadow-sm border" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Official Medical Record</p>
          <h3 className="mt-3 text-2xl font-bold text-[var(--text-primary)] tracking-tight">St. Mary&apos;s Medical Center</h3>
          <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--text-primary)]">
            {latestVoiceLog?.transcript ??
              "No transcription available yet. Record and save a voice log to generate a summary."}
          </p>
          <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--text-primary)]">
            Follow-up with primary care physician within 7 days. Return to ED for worsening shortness of breath.
          </p>
        </article>
      </section>
    </div>
  );
}
