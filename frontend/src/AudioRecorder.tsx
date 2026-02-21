import { useState, useRef, useCallback } from 'react';

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
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];
    for (const mt of candidates) {
      if (MediaRecorder.isTypeSupported(mt)) return mt;
    }
    return ''; // browser default
  };

  /** Trigger a file download into the user's Downloads folder. */
  const saveToDownloads = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  };

  /** Upload the recorded audio to the FastAPI backend. */
  const uploadToFastAPI = async (blob: Blob) => {
    const formData = new FormData();
    const ext = blob.type.includes('ogg')
      ? 'ogg'
      : blob.type.includes('mp4')
        ? 'mp4'
        : 'webm';
    formData.append('file', blob, `nursesync_log.${ext}`);

    try {
      const response = await fetch('http://localhost:8000/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('AI parsed data:', data);
    } catch (error) {
      console.error('Audio upload failed:', error);
    }
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
        // Build the final audio blob
        const finalMime = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: finalMime });

        if (audioBlob.size > 0) {
          // Generate a timestamped filename
          const now = new Date();
          const ts = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0'),
            '_',
            String(now.getHours()).padStart(2, '0'),
            String(now.getMinutes()).padStart(2, '0'),
            String(now.getSeconds()).padStart(2, '0'),
          ].join('');

          const ext = finalMime.includes('ogg')
            ? 'ogg'
            : finalMime.includes('mp4')
              ? 'mp4'
              : 'webm';

          // 1. Save to Downloads folder
          saveToDownloads(audioBlob, `nursesync_${ts}.${ext}`);

          // 2. Also upload to backend (fire-and-forget so it doesn't block the UI)
          uploadToFastAPI(audioBlob).catch(() => { });
        }

        // Release mic (kill the indicator light)
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
      console.error('Microphone access denied or unavailable:', error);
      alert('Microphone access denied. Please allow microphone permissions and try again.');
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
    if (isRecordingRef.current) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [startRecording, stopRecording]);

  return { isRecording, recordingDuration, startRecording, stopRecording, toggleRecording };
}