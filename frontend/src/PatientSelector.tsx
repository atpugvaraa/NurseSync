import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

interface Patient {
  id: string;
  name: string;
  ward: string;
  prescription?: any;
}

interface PatientSelectorProps {
  onSelect: (patient: Patient) => void;
  selectedId?: string;
}

export default function PatientSelector({ onSelect, selectedId }: PatientSelectorProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${BASE_URL}/api/patients/`)
      .then(({ data }) => setPatients(data.patients))
      .catch((err) => console.error("Failed to fetch patients:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.ward.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <div className="h-6 w-6 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400"
        />
      </div>

      {/* list */}
      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-4">No patients found</p>
        )}
        {filtered.map((patient) => (
          <button
            key={patient.id}
            type="button"
            onClick={() => onSelect(patient)}
            className="flex items-center justify-between rounded-2xl border p-4 text-left transition-all"
            style={{
              background: selectedId === patient.id ? "#f0fdfa" : "#fff",
              borderColor: selectedId === patient.id ? "#0d9488" : "#e2e8f0",
            }}
          >
            <div>
              <p className="font-bold text-slate-900">{patient.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{patient.ward}</p>
            </div>
            {selectedId === patient.id && (
              <span className="rounded-full bg-teal-500 px-2 py-0.5 text-[10px] font-bold text-white">
                Selected
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}