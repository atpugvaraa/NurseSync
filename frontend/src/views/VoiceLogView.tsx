import { Languages, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAudioRecorder } from "../AudioRecorder";
import { deriveEntityChips, toConfidencePercent } from "../api/mappers";
import StructuredLogCard from "../components/StructuredLogCard";
import RecordingOrb from "../components/RecordingOrb";
import type { AppOutletContext } from "../App";
import type { StructuredLog } from "../api/types";
import { useAppState } from "../state/AppStateContext";

export default function VoiceLogView() {
  const navigate = useNavigate();
  const { shiftId, nurseId } = useOutletContext<AppOutletContext>();
  const {
    selectedPatient,
    prescriptionContext,
    saveVoiceLog,
    latestVoiceLog,
  } = useAppState();

  const [transcript, setTranscript] = useState("");
  const [structuredLog, setStructuredLog] = useState<StructuredLog | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [needsReview, setNeedsReview] = useState(false);
  const [rawTranscript, setRawTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sttLanguage, setSttLanguage] = useState<"en" | "hi">("en");

  const {
    isRecording,
    isProcessing,
    recordingDuration,
    audioLevel,
    lastResult,
    resetLastResult,
    toggleRecording,
  } = useAudioRecorder({
    patientId: selectedPatient?.id ?? "",
    nurseId,
    shiftId,
    prescriptionContext,
    sttLanguage,
    onError: (err) => {
      console.error("Recording failed:", err);
      setError("Audio recording or upload failed. Please try again.");
    },
  });

  useEffect(() => {
    if (!lastResult) return;

    setRawTranscript(lastResult.raw_transcript);
    setTranscript(lastResult.clean_transcript);
    setStructuredLog(lastResult.structured_log);
    setNeedsReview(lastResult.needs_review);
    setConfidence(lastResult.confidence);
  }, [lastResult]);

  useEffect(() => {
    if (latestVoiceLog && !lastResult) {
      setRawTranscript(latestVoiceLog.rawTranscript);
      setTranscript(latestVoiceLog.transcript);
      setStructuredLog(latestVoiceLog.structuredLog);
      setNeedsReview(latestVoiceLog.needsReview);
      setConfidence(latestVoiceLog.confidence);
    }
  }, [lastResult, latestVoiceLog]);

  const confidencePercent = toConfidencePercent(confidence);
  const entityChips = useMemo(() => deriveEntityChips(structuredLog), [structuredLog]);

  const handleDiscard = () => {
    setError(null);
    setRawTranscript("");
    setTranscript("");
    setStructuredLog(null);
    setNeedsReview(false);
    setConfidence(0);
    resetLastResult();
    navigate("/dashboard");
  };

  const handleSave = () => {
    if (!selectedPatient || !lastResult) return;

    saveVoiceLog({
      id: lastResult.saved.id,
      patientId: selectedPatient.id,
      rawTranscript,
      cleanTranscript: lastResult.clean_transcript,
      transcript,
      confidence,
      needsReview,
      structuredLog,
      updatedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    navigate("/patients");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (!selectedPatient) {
    return (
      <div className="screen-wrapper" style={{ background: "#edf6f7" }}>
        <header className="screen-header">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="h-11 w-11 rounded-full border border-teal-200 bg-teal-50 grid place-items-center text-slate-700"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
          <h1 className="screen-title">Voice Log</h1>
          <div className="h-11 w-11" />
        </header>

        <section className="card p-5 text-center">
          <p className="text-lg font-bold text-slate-800">No patient selected</p>
          <p className="mt-2 text-sm text-slate-500">
            Choose a patient from the dashboard before recording a clinical log.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-4 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white"
          >
            Go to Dashboard
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="screen-wrapper" style={{ background: "#edf6f7" }}>
      <header className="screen-header">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="h-11 w-11 rounded-full border border-teal-200 bg-teal-50 grid place-items-center text-slate-700"
        >
          <X size={22} strokeWidth={2.5} />
        </button>

        <div className="text-center">
          <h1 className="screen-title">New Patient Log</h1>
          <p className="screen-subtitle">ID: #{selectedPatient.id.slice(0, 8)}</p>
        </div>

        <div className="lang-toggle-wrap">
          <button
            type="button"
            className={`lang-toggle-option ${sttLanguage === "en" ? "lang-active" : ""}`}
            onClick={() => setSttLanguage("en")}
            disabled={isRecording || isProcessing}
          >
            EN
          </button>
          <button
            type="button"
            className={`lang-toggle-option ${sttLanguage === "hi" ? "lang-active" : ""}`}
            onClick={() => setSttLanguage("hi")}
            disabled={isRecording || isProcessing}
          >
            हि
          </button>
          <Languages size={14} strokeWidth={2.5} className="lang-toggle-icon" />
        </div>
      </header>

      {error && (
        <section className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </section>
      )}

      <section className="card p-4">
        <div className="flex items-center justify-between">
          <p className="text-[32px] font-black text-slate-800">AI Confidence</p>
          <p className="text-2xl font-black text-teal-700">{confidencePercent.toFixed(1)}%</p>
        </div>

        <div className="mt-3 flex items-end justify-center gap-1">
          {Array.from({ length: 18 }).map((_, index) => {
            const base = 10 + ((index % 7) + 1) * 4;
            const wave = isRecording ? Math.round(audioLevel * 30) : 0;
            return (
              <span
                key={`bar-${index}`}
                className="w-1.5 rounded-full bg-gradient-to-b from-teal-300 to-teal-700"
                style={{ height: `${base + wave}px`, opacity: index % 2 === 0 ? 1 : 0.55 }}
              />
            );
          })}
        </div>
      </section>

      <section className="mt-4">
        <p className="section-title">Live Transcription</p>
        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          placeholder="Recording transcript will appear here..."
          className="card mt-3 min-h-[220px] w-full resize-y p-4 text-lg leading-relaxed text-slate-800 outline-none"
        />
      </section>

      <section className="mt-4">
        <p className="section-title">Identified Entities</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {entityChips.length > 0 ? (
            entityChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-700"
              >
                {chip}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500">
              Start recording to identify entities
            </span>
          )}
        </div>
      </section>

      <section className="mt-4">
        <StructuredLogCard structured={structuredLog} needsReview={needsReview} />
      </section>

      <section className="mt-6 flex flex-col items-center justify-center gap-3">
        <RecordingOrb
          isRecording={isRecording}
          isProcessing={isProcessing}
          audioLevel={audioLevel}
          onToggle={toggleRecording}
          disabled={!shiftId || isProcessing}
        />

        <p className="text-center text-xl font-black uppercase tracking-[0.18em] text-teal-700">
          {isProcessing
            ? "System processing..."
            : isRecording
              ? `System listening ${formatDuration(recordingDuration)}`
              : "System standby"}
        </p>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 pb-3">
        <button
          type="button"
          onClick={handleDiscard}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg font-bold text-slate-700"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!lastResult || isProcessing}
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-lg font-black text-emerald-300 disabled:opacity-50"
        >
          <Save size={18} strokeWidth={2.5} />
          Save Log
        </button>
      </section>
    </div>
  );
}
