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
    <div className="rounded-[20px] bg-white border p-4 shadow-sm" style={{ borderColor: 'var(--border-subtle)' }}>
      <p className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {icon}
        {label}
      </p>
      <p className="text-[14px] font-bold text-[var(--text-primary)] tracking-tight leading-relaxed">{value}</p>
    </div>
  );
}

export default function StructuredLogCard({
  structured,
  needsReview,
}: StructuredLogCardProps) {
  if (!structured) {
    return (
      <section className="glass-panel p-5 border shadow-sm" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">Structured Insights</p>
        <p className="mt-2 text-[14px] font-medium text-[var(--text-muted)]">
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
    <section className="glass-panel p-5 border shadow-sm" style={{ borderColor: "var(--border-subtle)" }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">Structured Insights</p>
          <h3 className="mt-1 text-[18px] font-bold capitalize text-[var(--text-primary)] tracking-tight">
            {action} entry
          </h3>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] shadow-sm whitespace-nowrap bg-white border" style={{ color: "var(--text-primary)", borderColor: "var(--border-subtle)" }}>
            Priority: {priority}
          </span>
          {needsReview ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-600 shadow-sm border border-amber-200 whitespace-nowrap">
              <AlertTriangle size={12} strokeWidth={2.5} />
              Needs review
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] shadow-sm whitespace-nowrap bg-white border" style={{ color: "var(--primary-accent)", borderColor: "var(--border-subtle)" }}>
              <ShieldCheck size={12} strokeWidth={2.5} />
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2">
        <DetailRow
          icon={<Pill size={13} style={{ color: "var(--primary-contrast)" }} />}
          label="Medication + Dose"
          value={`${medication} • ${dose}`}
        />
        <DetailRow
          icon={<Clock3 size={13} style={{ color: "var(--badge-text)" }} />}
          label="Mentioned Time"
          value={notedAt}
        />
        <DetailRow
          icon={<FileText size={13} style={{ color: "var(--primary)" }} />}
          label="Notes"
          value={notes}
        />
      </div>
    </section>
  );
}
