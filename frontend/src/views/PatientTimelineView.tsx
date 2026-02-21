import { ChevronLeft, Pill, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";

export default function PatientTimelineView() {
  const navigate = useNavigate();
  const { selectedPatient, latestVoiceLog } = useAppState();

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
          <p className="screen-subtitle">Room {selectedPatient.room}</p>
        </div>
      </header>

      <section className="card overflow-hidden">
        <div className="h-[220px] bg-gradient-to-br from-teal-700 to-cyan-900" />
        <div className="p-4">
          <h2 className="text-4xl font-black text-slate-900">
            {selectedPatient.name}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Room {selectedPatient.room} • Age {selectedPatient.age} • MRN{" "}
            {selectedPatient.mrn}
          </p>
        </div>
      </section>

      <section className="mt-4 space-y-3">
        <article className="card p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
            AI Alert • 02:15 AM
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-900">
            Irregular Breathing Pattern
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Detected subtle shift in respiratory rhythm. Recommend assessment of
            SpO2 levels.
          </p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm">
              Acknowledge
            </button>
            <button className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm">
              Check Vitals
            </button>
          </div>
        </article>

        <article className="card p-4">
          <div className="flex items-center gap-2 text-teal-700">
            <Stethoscope size={16} strokeWidth={2.4} />
            <p className="text-sm font-black">Routine Vitals • 01:45 AM</p>
          </div>
          <p className="mt-3 text-sm text-slate-700">
            BP 120/82 mmHg • HR 72 bpm • SpO2 98%
          </p>
        </article>

        <article className="card p-4">
          <div className="flex items-center gap-2 text-amber-600">
            <Pill size={16} strokeWidth={2.4} />
            <p className="text-sm font-black">Medication Admin • 12:30 AM</p>
          </div>
          <p className="mt-3 text-sm text-slate-700">
            Metoprolol Tartrate 25mg oral tablet administered.
          </p>
        </article>

        <article className="card p-4">
          <p className="text-sm leading-relaxed text-slate-700">
            {latestVoiceLog.transcript}
          </p>
          <button
            type="button"
            onClick={() => navigate("/voice-log")}
            className="mt-3 rounded-md border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-bold text-teal-700"
          >
            AI Transcribing Note...
          </button>
        </article>
      </section>
    </div>
  );
}
