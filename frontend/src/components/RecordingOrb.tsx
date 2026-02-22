import { Mic, Square } from "lucide-react";

type RecordingOrbProps = {
  isRecording: boolean;
  isProcessing: boolean;
  audioLevel: number;
  onToggle: () => void;
  disabled?: boolean;
};

export default function RecordingOrb({
  isRecording,
  isProcessing,
  audioLevel,
  onToggle,
  disabled,
}: RecordingOrbProps) {
  const outerScale = 1 + audioLevel * 0.14;
  const midScale = 1 + audioLevel * 0.1;

  return (
    <div className={`recording-orb-wrap ${isRecording ? "is-recording" : ""}`}>
      <div
        className={`recording-halo ${isRecording ? "is-active" : ""}`}
        style={{ transform: `scale(${outerScale})` }}
      />
      <div
        className={`recording-halo-secondary ${isRecording ? "is-active" : ""}`}
        style={{ transform: `scale(${midScale})` }}
      />

      <button
        type="button"
        aria-label={isRecording ? "Stop recording" : "Start recording"}
        onClick={onToggle}
        disabled={disabled || isProcessing}
        className={`recording-orb ${isRecording ? "is-recording" : ""}`}
      >
        {isRecording ? (
          <Square size={30} strokeWidth={2.8} />
        ) : (
          <Mic size={36} strokeWidth={2.6} />
        )}
      </button>
    </div>
  );
}
