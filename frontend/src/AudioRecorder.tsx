import { useState, useRef, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

const encodeWAV = (audioBuffer: AudioBuffer): Blob => {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1;
  const bitDepth = 16;

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

interface AudioRecorderOptions {
  patientId: string;
  nurseId: string;
  shiftId: string;
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
}

export function useAudioRecorder({
  patientId,
  nurseId,
  shiftId,
  onSuccess,
  onError,
}: AudioRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRecordingRef = useRef(false);

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
    return "";
  };

  const sendToBackend = async (wavBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", wavBlob, "recording.wav");
      formData.append("patient_id", patientId);
      formData.append("nurse_id", nurseId);
      formData.append("shift_id", shiftId);
      formData.append("prescription_context", "none");

      const { data } = await axios.post(
        `${BASE_URL}/api/logs/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Log saved:", data);
      onSuccess?.(data);
    } catch (err) {
      console.error("❌ Failed to send log:", err);
      onError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = useCallback(async () => {
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

      // ← fires the moment stop is called
      mediaRecorder.onstop = async () => {
        const finalMime = mediaRecorder.mimeType || "audio/webm";
        const rawAudioBlob = new Blob(audioChunksRef.current, { type: finalMime });

        if (rawAudioBlob.size > 0) {
          try {
            const arrayBuffer = await rawAudioBlob.arrayBuffer();
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const wavBlob = encodeWAV(audioBuffer);
            await sendToBackend(wavBlob);  // ← fires immediately on stop
          } catch (err) {
            console.error("Audio processing error:", err);
            onError?.(err);
          }
        }

        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      mediaRecorder.start(1000);
      isRecordingRef.current = true;
      setIsRecording(true);
      setRecordingDuration(0);

      durationTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Mic access denied:", error);
      alert("Microphone access denied. Please allow microphone permissions.");
    }
  }, [patientId, nurseId, shiftId]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecordingRef.current) {
      mediaRecorderRef.current.stop();  // ← triggers onstop → sendToBackend
      isRecordingRef.current = false;
      setIsRecording(false);

      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecordingRef.current) stopRecording();
    else startRecording();
  }, [startRecording, stopRecording]);

  return {
    isRecording,
    isProcessing,  // ← use this to show spinner while backend processes
    recordingDuration,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}