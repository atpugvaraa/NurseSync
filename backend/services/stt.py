import whisper
import tempfile
import os

model = whisper.load_model("base")

async def transcribe_audio(audio_bytes: bytes, filename: str = "audio.wav") -> dict:
    ext = os.path.splitext(filename)[1] or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as f:
        f.write(audio_bytes)
        tmp_path = f.name

    try:
        result = model.transcribe(tmp_path, fp16=False)
        segments = result.get("segments", [])
        if segments:
            avg_no_speech = sum(s.get("no_speech_prob", 0) for s in segments) / len(segments)
            confidence = round(1 - avg_no_speech, 2)
        else:
            confidence = 0.95

        return {
            "transcript": result["text"].strip(),
            "language": result.get("language", "en"),
            "confidence": confidence
        }
    finally:
        os.unlink(tmp_path)