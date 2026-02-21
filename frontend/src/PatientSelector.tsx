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
        <div className="h-6 w-6 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
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
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400"
        />
      </div>

      <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-400">No patients found</p>
        )}

        {filtered.map((patient) => {
          const active = selectedId === patient.id;
          return (
            <button
              key={patient.id}
              type="button"
              onClick={() => onSelect(patient)}
              className="flex items-center justify-between rounded-2xl border p-4 text-left transition-all"
              style={{
                background: active ? "#f0fdfa" : "#fff",
                borderColor: active ? "#0d9488" : "#e2e8f0",
              }}
            >
              <div>
                <p className="font-bold text-slate-900">{patient.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{patient.ward}</p>
              </div>
              {active && (
                <span className="rounded-full bg-teal-500 px-2 py-0.5 text-[10px] font-bold text-white">
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
