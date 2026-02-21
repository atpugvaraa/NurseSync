import { useState } from "react";
import { Bell, Brain, Mic, Search, TrendingUp, TriangleAlert, ChevronDown } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAudioRecorder } from "./AudioRecorder";
import { useAppState } from "./state/AppStateContext";
import PatientSelector from "./PatientSelector";

interface Patient {
  id: string;
  name: string;
  ward: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { tasks } = useAppState();
  const { shiftId, nurseId } = useOutletContext<{ shiftId: string; nurseId: string }>();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const { isRecording, isProcessing, recordingDuration, toggleRecording } =
    useAudioRecorder({
      patientId: selectedPatient?.id || "",
      nurseId: nurseId,
      shiftId: shiftId,
      onSuccess: (data) => {
        console.log("✅ Transcript:", data.clean_transcript);
        console.log("💊 Structured:", data.structured_log);
      },
      onError: (err) => console.error("❌ Log failed:", err),
    });

  const openTasks = tasks.filter((t) => !t.completed).length;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="screen-wrapper text-slate-900" style={{ background: "#eef4f5" }}>
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

      <main className="flex flex-col gap-4 pb-32">
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

        {/* patient selector */}
        <section className="card p-5">
          <p className="section-title mb-3">Select Patient</p>
          <button
            type="button"
            onClick={() => setShowSelector(!showSelector)}
            className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
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
                onSelect={(p) => {
                  setSelectedPatient(p);
                  setShowSelector(false);
                }}
              />
            </div>
          )}
        </section>

        {selectedPatient && (
          <section className="card p-5">
            <p className="section-title">Selected Patient</p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedPatient.name}</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">{selectedPatient.ward}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                Stable
              </span>
            </div>
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

      {/* record button */}
      <div className="fixed bottom-[104px] z-30 flex flex-col items-center gap-2 left-1/2 -translate-x-1/2">
        {isProcessing && (
          <div className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            Processing...
          </div>
        )}
        {isRecording && !isProcessing && (
          <div className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            Recording {formatDuration(recordingDuration)}
          </div>
        )}
        {!selectedPatient && !isRecording && (
          <div className="rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            Select a patient first
          </div>
        )}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={isProcessing || !selectedPatient}
          className="h-[60px] w-[60px] rounded-full text-white shadow-xl transition-all disabled:opacity-40"
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