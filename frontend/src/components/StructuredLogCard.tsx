import type { ReactNode } from "react";
import { AlertTriangle, Clock3, FileText, Pill, ShieldCheck } from "lucide-react";
import type { StructuredLog } from "../api/types";

interface StructuredLogCardProps {
  structured: StructuredLog | null;
  needsReview: boolean;
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
      <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
        {icon}
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export default function StructuredLogCard({
  structured,
  needsReview,
}: StructuredLogCardProps) {
  if (!structured) {
    return (
      <section className="card p-4">
        <p className="section-title">Structured Insights</p>
        <p className="mt-3 text-sm text-slate-500">
          Record audio to generate structured clinical fields.
        </p>
      </section>
    );
  }

  const action = structured.action_type || "note";
  const medication = structured.medication || "Not detected";
  const dose = structured.dose || "Not detected";
  const notedAt = structured.time_mentioned || "Not captured";
  const notes = structured.notes || "No additional observations.";
  const priority = structured.priority || "low";

  return (
    <section className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="section-title">Structured Insights</p>
          <h3 className="mt-1 text-lg font-extrabold capitalize text-slate-900">
            {action} entry
          </h3>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-teal-700">
            Priority: {priority}
          </span>
          {needsReview ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700">
              <AlertTriangle size={12} />
              Needs review
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
              <ShieldCheck size={12} />
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2">
        <DetailRow
          icon={<Pill size={13} className="text-teal-700" />}
          label="Medication + Dose"
          value={`${medication} • ${dose}`}
        />
        <DetailRow
          icon={<Clock3 size={13} className="text-sky-700" />}
          label="Mentioned Time"
          value={notedAt}
        />
        <DetailRow
          icon={<FileText size={13} className="text-indigo-700" />}
          label="Notes"
          value={notes}
        />
      </div>
    </section>
  );
}
