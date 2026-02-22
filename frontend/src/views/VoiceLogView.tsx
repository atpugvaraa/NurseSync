import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Languages, Mic, Save, Square, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAudioRecorder } from "../AudioRecorder";
import { deriveEntityChips, toConfidencePercent } from "../api/mappers";
import StructuredLogCard from "../components/StructuredLogCard";
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
  const [showResults, setShowResults] = useState(false);

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
    setShowResults(true);
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
    setShowResults(false);
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
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Edge glow — all from #8cc7a1 at different opacities
  const glowIntensity = isRecording ? 40 + audioLevel * 60 : isProcessing ? 35 : 20;
  const glowOpacity = isRecording ? 0.15 + audioLevel * 0.35 : isProcessing ? 0.2 : 0.08;
  const glowColor = `rgba(140, 199, 161, ${glowOpacity})`;

  const orbScale = isRecording ? 1 + audioLevel * 0.12 : 1;
  const statusMode = isProcessing ? "is-processing" : isRecording ? "is-recording" : "";

  // ─── No Patient Selected ───
  if (!selectedPatient) {
    return (
      <div className="siri-viewport flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          className="glass-panel p-8 max-w-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Mic size={40} strokeWidth={1.8} style={{ color: "rgba(140, 199, 161, 0.4)", margin: "0 auto" }} />
          <p className="mt-4 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            No patient selected
          </p>
          <p className="mt-2 text-[13px] font-medium" style={{ color: "var(--text-muted)" }}>
            Choose a patient from the dashboard before recording.
          </p>
          <motion.button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-full px-6 py-3 text-[13px] font-bold text-white shadow-sm"
            style={{ background: "rgba(140, 199, 161, 0.85)" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Go to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─── Main Siri-Style UI ───
  return (
    <div className="siri-viewport">
      {/* Ambient Background */}
      <div className={`siri-ambient-bg ${statusMode}`} />

      {/* Reactive Edge Glow */}
      <div
        className="siri-edge-glow"
        style={{
          boxShadow: `inset 0 0 ${glowIntensity}px 3px ${glowColor}`,
          transition: isRecording ? "box-shadow 80ms ease" : "box-shadow 400ms ease",
        }}
      />

      {/* ─── Content ─── */}
      <div className="relative z-10 flex flex-col min-h-[100dvh] p-4">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="h-10 w-10 rounded-full border bg-white/70 backdrop-blur-sm grid place-items-center shadow-sm"
            style={{ borderColor: "rgba(140, 199, 161, 0.12)", color: "var(--text-primary)" }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            <X size={20} strokeWidth={2.2} />
          </motion.button>

          <div className="text-center">
            <h1 className="text-[15px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Voice Log
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(140, 199, 161, 0.7)" }}>
              {selectedPatient.name}
            </p>
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
            <Languages size={12} strokeWidth={2.5} className="lang-toggle-icon" />
          </div>
        </motion.header>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.section
              className="mb-3 rounded-2xl border bg-rose-50/80 backdrop-blur-sm px-4 py-3 text-[13px] font-semibold text-rose-600"
              style={{ borderColor: "rgba(244, 63, 94, 0.2)" }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {error}
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── Central Recording Area ─── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {/* Status Text */}
          <motion.div
            className="text-center"
            key={isProcessing ? "processing" : isRecording ? "recording" : "standby"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p
              className="text-[12px] font-bold uppercase tracking-[0.16em]"
              style={{
                color: isRecording
                  ? "rgba(140, 199, 161, 0.9)"
                  : "rgba(140, 199, 161, 0.5)",
              }}
            >
              {isProcessing
                ? "Processing audio..."
                : isRecording
                  ? `Listening ${formatDuration(recordingDuration)}`
                  : "Ready to record"}
            </p>
          </motion.div>

          {/* Recording Orb */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{ width: 180, height: 180 }}
          >
            {/* Outer halo */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(140, 199, 161, ${isRecording ? 0.08 + audioLevel * 0.12 : 0.04}), transparent)`,
              }}
              animate={{ scale: isRecording ? 1 + audioLevel * 0.15 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />

            {/* Inner halo */}
            <motion.div
              className="absolute rounded-full"
              style={{
                inset: 20,
                background: `radial-gradient(circle, rgba(140, 199, 161, ${isRecording ? 0.12 + audioLevel * 0.18 : 0.06}), transparent)`,
              }}
              animate={{ scale: isRecording ? 1 + audioLevel * 0.1 : 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
            />

            {/* The orb */}
            <motion.button
              type="button"
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              onClick={toggleRecording}
              disabled={!shiftId || isProcessing}
              className="relative z-10 rounded-full border-[5px] grid place-items-center text-white shadow-lg disabled:opacity-35"
              style={{
                width: 100,
                height: 100,
                borderColor: "rgba(255, 255, 255, 0.65)",
                background: isRecording
                  ? "linear-gradient(145deg, #4da36d, #5AAF78)"
                  : "linear-gradient(145deg, #5AAF78, #6fba8c)",
                boxShadow: isRecording
                  ? `0 0 0 6px rgba(90, 175, 120, 0.18), 0 10px 24px rgba(90, 175, 120, 0.32)`
                  : `0 0 0 6px rgba(90, 175, 120, 0.08), 0 10px 24px rgba(90, 175, 120, 0.18)`,
              }}
              animate={{ scale: orbScale }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              whileTap={{ scale: 0.92 }}
            >
              <AnimatePresence mode="wait">
                {isRecording ? (
                  <motion.div
                    key="stop"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Square size={28} strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mic"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Mic size={34} strokeWidth={2} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Waveform Bars */}
          <div className="flex items-end justify-center gap-[3px]">
            {Array.from({ length: 24 }).map((_, i) => {
              const baseH = 4 + ((i % 5) + 1) * 3;
              const dynamicH = isRecording ? baseH + audioLevel * 20 * (1 + Math.sin(i * 0.8)) : baseH;
              const barOpacity = isRecording ? 0.4 + audioLevel * 0.5 : 0.15;
              return (
                <motion.span
                  key={`bar-${i}`}
                  className="rounded-full"
                  style={{
                    width: 3,
                    background: `rgba(140, 199, 161, ${barOpacity})`,
                  }}
                  animate={{ height: dynamicH }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                />
              );
            })}
          </div>

          {/* Confidence Badge */}
          {(lastResult || latestVoiceLog) && (
            <motion.div
              className="flex items-center gap-2 rounded-full px-4 py-2 border"
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(12px)",
                borderColor: "rgba(140, 199, 161, 0.15)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={13} strokeWidth={2.2} style={{ color: "rgba(140, 199, 161, 0.7)" }} />
              <span className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>
                {confidencePercent.toFixed(0)}% confidence
              </span>
            </motion.div>
          )}
        </div>

        {/* ─── Transcript + Results ─── */}
        <AnimatePresence>
          {(transcript || showResults) && (
            <motion.div
              className="mt-4 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="glass-panel p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-soft)" }}>
                    Transcript
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowResults((prev) => !prev)}
                    className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                    style={{ color: "rgba(140, 199, 161, 0.7)" }}
                  >
                    Details
                    <motion.span animate={{ rotate: showResults ? 180 : 0 }}>
                      <ChevronDown size={12} />
                    </motion.span>
                  </button>
                </div>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Transcript will appear here..."
                  className="w-full bg-transparent resize-none text-[14px] font-medium leading-relaxed outline-none min-h-[80px]"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>

              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 overflow-hidden"
                  >
                    {entityChips.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entityChips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/70"
                            style={{ borderColor: "rgba(140, 199, 161, 0.15)", color: "var(--text-primary)" }}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}
                    <StructuredLogCard structured={structuredLog} needsReview={needsReview} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Action Buttons ─── */}
        <motion.section
          className="grid grid-cols-2 gap-3 pb-4 pt-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          <motion.button
            type="button"
            onClick={handleDiscard}
            className="rounded-full border bg-white/70 backdrop-blur-sm px-5 py-3.5 text-[13px] font-bold shadow-sm"
            style={{ borderColor: "rgba(140, 199, 161, 0.12)", color: "var(--text-primary)" }}
            whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(140, 199, 161, 0.1)" }}
            whileTap={{ scale: 0.97 }}
          >
            <X size={15} strokeWidth={2.4} className="inline mr-1.5" style={{ verticalAlign: "middle" }} />
            Discard
          </motion.button>
          <motion.button
            type="button"
            onClick={handleSave}
            disabled={!lastResult || isProcessing}
            className="flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[13px] font-bold text-white shadow-sm disabled:opacity-35"
            style={{ background: "rgba(140, 199, 161, 0.85)" }}
            whileHover={{ scale: 1.03, boxShadow: "0 4px 20px rgba(140, 199, 161, 0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            <Save size={15} strokeWidth={2.4} />
            Save Log
          </motion.button>
        </motion.section>
      </div>
    </div>
  );
}
