import { useEffect, useState } from "react";
import { listPatients } from "./api/client";
import type { Patient } from "./api/types";

interface PatientSelectorProps {
  onSelect: (patient: Patient) => void;
  selectedId?: string;
}

export default function PatientSelector({
  onSelect,
  selectedId,
}: PatientSelectorProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    listPatients()
      .then((data) => {
        if (!cancelled) setPatients(data.patients);
      })
      .catch((err) => {
        if (!cancelled) console.error("Failed to fetch patients:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = patients.filter((p) => {
    const haystack = `${p.name} ${p.ward}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  if (loading)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--primary)" }} />
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-soft)] outline-none focus:border-[var(--primary)] transition-colors shadow-sm backdrop-blur-md"
          style={{ backgroundColor: "var(--bg-glass)", borderColor: "var(--border-subtle)" }}
        />
      </div>

      <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-[var(--text-muted)]">No patients found</p>
        )}

        {filtered.map((patient) => {
          const active = selectedId === patient.id;
          return (
            <button
              key={patient.id}
              type="button"
              onClick={() => onSelect(patient)}
              className="flex items-center justify-between rounded-2xl border p-4 text-left transition-all hover:scale-[1.01] shadow-sm backdrop-blur-md"
              style={{
                backgroundColor: "var(--bg-glass)",
                borderColor: active ? "var(--primary)" : "var(--border-subtle)",
              }}
            >
              <div>
                <p className="font-bold text-[var(--text-primary)]">{patient.name}</p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{patient.ward}</p>
              </div>
              {active && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: "var(--primary)" }}>
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
