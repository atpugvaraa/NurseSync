import { CheckCircle2, ChevronLeft, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";

export default function DischargeSummaryView() {
  const navigate = useNavigate();
  const { selectedPatient, latestVoiceLog } = useAppState();

  return (
    <div className="screen-wrapper" style={{ background: "#f3f5f6" }}>
      <header className="screen-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full bg-white grid place-items-center text-slate-600 shadow-sm"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-[28px] font-black text-slate-900">
          Discharge Summary
        </h1>
        <button className="h-10 w-10 rounded-full bg-white grid place-items-center text-teal-700 shadow-sm">
          <Share2 size={18} strokeWidth={2.5} />
        </button>
      </header>

      <section className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-4xl font-black text-slate-900">
              {selectedPatient.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              ID #{selectedPatient.id} • Room {selectedPatient.room}
            </p>
          </div>
          <span className="rounded-full border border-teal-300 bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
            READY FOR REVIEW
          </span>
        </div>
      </section>

      <section className="mt-4 space-y-3">
        <article className="card flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xl font-black text-slate-900">
              Clinical Course & History
            </p>
            <p className="text-sm text-slate-500">
              Extracted from latest voice log
            </p>
          </div>
          <CheckCircle2 size={18} strokeWidth={2.5} className="text-teal-600" />
        </article>

        <article className="card flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xl font-black text-slate-900">
              Treatments & Labs
            </p>
            <p className="text-sm text-slate-500">All metrics updated today</p>
          </div>
          <CheckCircle2 size={18} strokeWidth={2.5} className="text-teal-600" />
        </article>

        <article className="card flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xl font-black text-slate-900">
              Medication Reconciliation
            </p>
            <p className="text-sm text-teal-700">2 pending confirmations</p>
          </div>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-700">
            FIX
          </span>
        </article>
      </section>

      <button className="mt-4 w-full rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-400 px-4 py-4 text-xl font-black text-white">
        Generate AI Summary
      </button>

      <section className="card mt-4 p-5">
        <p className="section-title">Document Preview</p>
        <article className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Official Medical Record
          </p>
          <h3 className="mt-3 text-3xl font-black text-slate-900">
            St. Mary&apos;s Medical Center
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            {latestVoiceLog.transcript}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            Follow-up with primary care physician within 7 days. Return to ED
            for worsening shortness of breath.
          </p>
        </article>
      </section>
    </div>
  );
}
