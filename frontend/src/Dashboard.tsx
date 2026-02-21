import {
  Bell,
  Brain,
  Mic,
  Search,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAudioRecorder } from "./AudioRecorder";
import { useAppState } from "./state/AppStateContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedPatient, tasks } = useAppState();
  const { isRecording, recordingDuration, toggleRecording } =
    useAudioRecorder();

  const openTasks = tasks.filter((task) => !task.completed).length;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div
      className="screen-wrapper text-slate-900"
      style={{ background: "#eef4f5" }}
    >
      <header
        className="screen-header sticky top-0 z-10 py-1"
        style={{ backdropFilter: "blur(10px)" }}
      >
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

      <main className="flex flex-col gap-4 pb-6">
        <section className="grid grid-cols-3 gap-3">
          <article className="card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Patients
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-800">12</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-teal-600">
              <TrendingUp size={12} strokeWidth={3} /> +2 today
            </p>
          </article>
          <article className="card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Open Tasks
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-800">
              {openTasks}
            </p>
            <p className="mt-1 text-[11px] font-bold text-amber-500">
              Requires action
            </p>
          </article>
          <article className="card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Shift
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-800">65%</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-teal-600 to-teal-400" />
            </div>
          </article>
        </section>

        <section className="card overflow-hidden">
          <div className="border-l-4 border-rose-400 p-4">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-xl border border-slate-100 bg-slate-50 grid place-items-center">
                <Brain size={22} className="text-slate-700" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  AI Insight
                </p>
                <h2 className="mt-1 text-[15px] font-bold text-slate-900">
                  {selectedPatient.name} in Room {selectedPatient.room}:
                  elevated heart-rate pattern detected
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Immediate check recommended. Linked records are ready for
                  handoff review.
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

        <section className="card p-5">
          <p className="section-title">Primary Patient</p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {selectedPatient.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                ID #{selectedPatient.id} • Room {selectedPatient.room} • MRN{" "}
                {selectedPatient.mrn}
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
              Stable
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            <TriangleAlert size={15} strokeWidth={2.5} />
            Irregular breathing note flagged for review.
          </div>
        </section>
      </main>

      <div className="fixed bottom-[104px] z-30 flex flex-col items-center gap-2">
        {isRecording ? (
          <div className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            Recording {formatDuration(recordingDuration)}
          </div>
        ) : null}
        <button
          type="button"
          onClick={toggleRecording}
          className="h-[60px] w-[60px] rounded-full text-white shadow-xl transition-all"
          style={{
            background: isRecording ? "#ef4444" : "#0d9488",
            boxShadow: isRecording
              ? "0 0 0 4px rgba(239,68,68,0.25)"
              : "0 8px 24px rgba(13,148,136,0.35)",
          }}
        >
          <Mic size={26} strokeWidth={2.5} className="mx-auto" />
        </button>
      </div>
    </div>
  );
}
