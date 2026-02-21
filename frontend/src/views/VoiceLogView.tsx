import { Globe, Mic, Save, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";

export default function VoiceLogView() {
  const navigate = useNavigate();
  const { selectedPatient, latestVoiceLog, saveVoiceLog } = useAppState();
  const [transcript, setTranscript] = useState(latestVoiceLog.transcript);

  const handleSave = () => {
    saveVoiceLog({
      id: latestVoiceLog.id,
      transcript,
      confidence: latestVoiceLog.confidence,
      updatedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    navigate("/patients");
  };

  return (
    <div className="screen-wrapper" style={{ background: "#edf6f7" }}>
      <header className="screen-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-11 w-11 rounded-full border border-teal-200 bg-teal-50 grid place-items-center text-slate-700"
        >
          <X size={22} strokeWidth={2.5} />
        </button>

        <div className="text-center">
          <h1 className="screen-title">New Patient Log</h1>
          <p className="screen-subtitle">ID: #{selectedPatient.id}</p>
        </div>

        <button className="inline-flex h-11 items-center gap-1 rounded-full border border-teal-200 bg-white px-3 text-sm font-bold text-teal-700">
          ENGLISH
          <Globe size={14} strokeWidth={2.5} />
        </button>
      </header>

      <section className="card p-4">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-black text-slate-800">AI Confidence</p>
          <p className="text-2xl font-black text-teal-700">
            {latestVoiceLog.confidence.toFixed(1)}%
          </p>
        </div>
      </section>

      <section className="mt-4">
        <p className="section-title">Live Transcription</p>
        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          className="card mt-3 min-h-[220px] w-full resize-y p-4 text-lg leading-relaxed text-slate-800 outline-none"
        />
      </section>

      <section className="mt-4 flex items-center justify-center">
        <button className="h-36 w-36 rounded-full border-4 border-white bg-teal-600 text-white shadow-xl">
          <Mic size={40} strokeWidth={2.5} className="mx-auto" />
        </button>
      </section>

      <p className="mt-4 text-center text-xl font-black uppercase tracking-[0.18em] text-teal-700">
        System Listening...
      </p>

      <section className="mt-6 grid grid-cols-2 gap-3 pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg font-bold text-slate-700"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-lg font-black text-emerald-300"
        >
          <Save size={18} strokeWidth={2.5} />
          Save Log
        </button>
      </section>
    </div>
  );
}
