import { useState, useRef, useCallback } from "react";
import axios from "axios";

// the magic 20%: manually writing the wav file headers byte-by-byte
const encodeWAV = (audioBuffer: AudioBuffer): Blob => {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // pcm
  const bitDepth = 16;

  // interleave channels if stereo
  const result = new Float32Array(audioBuffer.length * numChannels);
  if (numChannels === 2) {
    const left = audioBuffer.getChannelData(0);
    const right = audioBuffer.getChannelData(1);
    for (let i = 0; i < audioBuffer.length; i++) {
      result[i * 2] = left[i];
      result[i * 2 + 1] = right[i];
    }
  } else {
    result.set(audioBuffer.getChannelData(0));
  }

  const dataLength = result.length * (bitDepth / 8);
  const bufferLength = 44 + dataLength;
  const dataView = new DataView(new ArrayBuffer(bufferLength));

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(dataView, 0, "RIFF");
  dataView.setUint32(4, 36 + dataLength, true);
  writeString(dataView, 8, "WAVE");
  writeString(dataView, 12, "fmt ");
  dataView.setUint32(16, 16, true);
  dataView.setUint16(20, format, true);
  dataView.setUint16(22, numChannels, true);
  dataView.setUint32(24, sampleRate, true);
  dataView.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  dataView.setUint16(32, numChannels * (bitDepth / 8), true);
  dataView.setUint16(34, bitDepth, true);
  writeString(dataView, 36, "data");
  dataView.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < result.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, result[i]));
    dataView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([dataView], { type: "audio/wav" });
};

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Use a ref to track the "real" recording state so that the ondataavailable /
  // onstop callbacks always see the freshest value, avoiding a stale-closure bug
  // that can occur with React state inside event handlers.
  const isRecordingRef = useRef(false);

  /** Pick the first supported MIME type from our preference list. */
  const pickMimeType = (): string => {
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];
    for (const mt of candidates) {
      if (MediaRecorder.isTypeSupported(mt)) return mt;
    }
    return ""; // browser default
    return "";
  };

  const startRecording = useCallback(async () => {
    // Prevent double-start
    if (isRecordingRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = pickMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const finalMime = mediaRecorder.mimeType || "audio/webm";
        const rawAudioBlob = new Blob(audioChunksRef.current, {
          type: finalMime,
        });

        if (rawAudioBlob.size > 0) {
          try {
            const arrayBuffer = await rawAudioBlob.arrayBuffer();
            const audioContext = new (
              window.AudioContext || (window as any).webkitAudioContext
            )();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const wavBlob = encodeWAV(audioBuffer);

            // ── SEND TO BACKEND ──────────────────────────────
            const formData = new FormData();
            formData.append("audio", wavBlob, "recording.wav");
            formData.append(
              "patient_id",
              "a0000000-0000-0000-0000-000000000001",
            );
            formData.append("nurse_id", "b0000000-0000-0000-0000-000000000001");
            formData.append("shift_id", "YOUR_SHIFT_UUID_HERE");
            formData.append("prescription_context", "none");

            const { data } = await axios.post(
              "http://localhost:8000/api/logs/create",
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              },
            );

            console.log("✅ Log saved:", data);
            console.log("📝 Raw transcript:", data.raw_transcript);
            console.log("🧹 Clean transcript:", data.clean_transcript);
            console.log("💊 Structured log:", data.structured_log);
            // ─────────────────────────────────────────────────
          } catch (err) {
            console.error("failed to process audio:", err);
          }
        }

        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      // Request data every second so no data is lost on abrupt stops
      mediaRecorder.start(1000);

      isRecordingRef.current = true;
      setIsRecording(true);
      setRecordingDuration(0);

      // Start a duration counter
      durationTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Microphone access denied or unavailable:", error);
      alert(
        "Microphone access denied. Please allow microphone permissions and try again.",
      );
      console.error("mic access denied:", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecordingRef.current) {
      mediaRecorderRef.current.stop();
      isRecordingRef.current = false;
      setIsRecording(false);

      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    }
  }, []);

  /** Toggle — one tap starts, next tap stops. Useful for the FAB button. */
  const toggleRecording = useCallback(() => {
    if (isRecordingRef.current) stopRecording();
    else startRecording();
  }, [startRecording, stopRecording]);

  return {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
