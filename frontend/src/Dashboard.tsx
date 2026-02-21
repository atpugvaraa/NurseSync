import { Bell, Brain, ChevronDown, Mic, Search, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientSelector from "./PatientSelector";
import { deriveEntityChips } from "./api/mappers";
import { useAppState } from "./state/AppStateContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    tasks,
    selectedPatient,
    setSelectedPatient,
    latestVoiceLog,
    prescriptionContext,
  } = useAppState();

  const [showSelector, setShowSelector] = useState(false);

  const openTasks = tasks.filter((task) => !task.completed).length;
  const entityChips = useMemo(
    () => deriveEntityChips(latestVoiceLog?.structuredLog ?? null),
    [latestVoiceLog],
  );

  return (
    <div className="screen-wrapper text-slate-900" style={{ background: "#e9f2f3" }}>
      <header className="screen-header sticky top-0 z-10 py-1" style={{ backdropFilter: "blur(10px)" }}>
        <div>
          <p className="screen-subtitle">Evening Shift • ICU</p>
          <h1 className="screen-title">NurseSync Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 rounded-full bg-white grid place-items-center text-slate-500 shadow-sm">
            <Search size={18} strokeWidth={2.5} />
          </button>
          <button className="relative h-10 w-10 rounded-full bg-white grid place-items-center text-slate-500 shadow-sm">
            <Bell size={18} strokeWidth={2.5} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-4 pb-36">
        <section className="grid grid-cols-3 gap-3">
          <article className="card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Patients</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-800">12</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-teal-600">
              <TrendingUp size={12} strokeWidth={3} /> +2 today
            </p>
          </article>
          <article className="card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Open Tasks</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-800">{openTasks}</p>
            <p className="mt-1 text-[11px] font-bold text-amber-500">Requires action</p>
          </article>
          <article className="card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Shift</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-800">65%</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-teal-600 to-teal-400" />
            </div>
          </article>
        </section>

        <section className="card p-5">
          <p className="section-title mb-3">Select Patient</p>
          <button
            type="button"
            onClick={() => setShowSelector((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <span className="font-bold text-slate-800">
              {selectedPatient ? selectedPatient.name : "Tap to select patient"}
            </span>
            <ChevronDown
              size={18}
              className="text-slate-400 transition-transform"
              style={{ transform: showSelector ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
          {showSelector && (
            <div className="mt-3">
              <PatientSelector
                selectedId={selectedPatient?.id}
                onSelect={(patient) => {
                  setSelectedPatient(patient);
                  setShowSelector(false);
                }}
              />
            </div>
          )}
        </section>

        <section className="dashboard-hero card p-6 text-center">
          <p className="section-title">Voice Log Center</p>
          <p className="mt-2 text-lg font-semibold text-slate-700">
            {selectedPatient
              ? `Ready for ${selectedPatient.name} (${selectedPatient.ward})`
              : "Select a patient to begin"}
          </p>

          <button
            type="button"
            onClick={() => navigate("/voice-log")}
            disabled={!selectedPatient}
            className="hero-mic-button mt-6"
          >
            <Mic size={58} strokeWidth={2.4} />
          </button>

          <p className="mt-4 text-base font-black uppercase tracking-[0.16em] text-teal-700">
            {selectedPatient ? "Tap to start recording" : "Patient selection required"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Prescription context: {prescriptionContext === "none" ? "Not attached" : "Attached"}
          </p>
        </section>

        {latestVoiceLog && (
          <section className="card p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="section-title">Latest Structured Log</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">{latestVoiceLog.updatedAt}</p>
              </div>
              {latestVoiceLog.needsReview && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  Needs Review
                </span>
              )}
            </div>
            <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">
              {latestVoiceLog.transcript}
            </p>
            {entityChips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {entityChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="card overflow-hidden">
          <div className="border-l-4 border-rose-400 p-4">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-xl border border-slate-100 bg-slate-50 grid place-items-center">
                <Brain size={22} className="text-slate-700" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI Insight</p>
                <h2 className="mt-1 text-[15px] font-bold text-slate-900">
                  Elevated heart-rate pattern detected
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Immediate check recommended. Linked records are ready for handoff review.
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/handoff")}
                className="rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700"
              >
                View Records
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
