import {
  ChevronLeft,
  ClipboardList,
  Heart,
  Pencil,
  Play,
  Send,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "./state/AppStateContext";

export default function HandoffScreen() {
  const navigate = useNavigate();
  const { selectedPatient, tasks, toggleTask, latestVoiceLog } = useAppState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  const taskPreview = useMemo(() => tasks.slice(0, 3), [tasks]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setPlayProgress(0);

    const intervalId = window.setInterval(() => {
      setPlayProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(intervalId);
          setIsPlaying(false);
          return 0;
        }

        return prev + 4;
      });
    }, 120);
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
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full bg-white grid place-items-center text-slate-600 shadow-sm"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-extrabold text-slate-900">
          Shift Handoff Summary
        </h1>
        <div className="h-10 w-10" />
      </header>

      <main className="flex flex-col gap-4 pb-6">
        <section className="card p-5">
          <p className="section-title">Patient</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            {selectedPatient.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Room {selectedPatient.room} • {selectedPatient.age} y/o • MRN{" "}
            {selectedPatient.mrn}
          </p>
          <span className="mt-3 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-teal-700">
            Ready for Review
          </span>
        </section>

        <section className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={14} strokeWidth={2.5} className="text-teal-600" />
            <p className="section-title text-teal-700">AI Clinical Overview</p>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Patient responded well to nebulizer treatment. Respiratory rate is
            stable. Latest voice log confidence is
            <span className="font-bold text-slate-900">
              {" "}
              {latestVoiceLog.confidence.toFixed(1)}%
            </span>
            .
          </p>

          <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
            <button
              type="button"
              onClick={handlePlayToggle}
              className="flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white"
            >
              <Play size={14} strokeWidth={2.5} />
              {isPlaying ? "Playing" : "Play Voice Log"}
            </button>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-teal-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400"
                style={{ width: `${playProgress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Heart size={14} strokeWidth={2.5} className="text-rose-500" />
            <p className="section-title">Critical Alerts</p>
          </div>
          <p className="rounded-2xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
            Tachycardia episode peaked at 115 BPM at 16:45. Resolved after rest
            and IV fluids.
          </p>
        </section>

        <section className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardList
              size={14}
              strokeWidth={2.5}
              className="text-teal-600"
            />
            <p className="section-title">Handoff Tasks</p>
          </div>
          <div className="space-y-3">
            {taskPreview.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleTask(task.id)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left"
              >
                <span
                  className="text-sm font-semibold text-slate-800"
                  style={{ opacity: task.completed ? 0.5 : 1 }}
                >
                  {task.title}
                </span>
                <span
                  className={
                    task.completed
                      ? "rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-700"
                      : "rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700"
                  }
                >
                  {task.completed ? "Done" : "Open"}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate("/discharge-summary")}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700"
          >
            <Pencil size={16} strokeWidth={2.5} />
            Edit Summary
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-400 px-4 py-3 font-bold text-white"
          >
            <Send size={16} strokeWidth={2.5} />
            Send Handoff
          </button>
        </section>
      </main>
    </div>
  );
}
