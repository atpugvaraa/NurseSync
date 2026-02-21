import asyncio
import os
import tempfile

from sarvamai import SarvamAI
import whisper

whisper_model = whisper.load_model("base")


def _normalize_provider(provider: str) -> str:
    provider_norm = (provider or "whisper").strip().lower()
    if provider_norm not in {"whisper", "sarvam"}:
        return "whisper"
    return provider_norm


def _normalize_language(language_hint: str) -> str:
    lang = (language_hint or "en").strip().lower()
    if lang.startswith("hi"):
        return "hi"
    return "en"


def _sarvam_language_code(language_hint: str) -> str:
    return "hi-IN" if _normalize_language(language_hint) == "hi" else "en-IN"


def _transcribe_with_whisper(tmp_path: str, language_hint: str) -> dict:
    language = _normalize_language(language_hint)
    result = whisper_model.transcribe(tmp_path, fp16=False, language=language)

    segments = result.get("segments", [])
    if segments:
        avg_no_speech = sum(s.get("no_speech_prob", 0) for s in segments) / len(segments)
        confidence = round(max(0.0, 1 - avg_no_speech), 2)
    else:
        confidence = 0.95

    return {
        "transcript": result.get("text", "").strip(),
        "language": result.get("language", language),
        "confidence": confidence,
        "provider": "whisper",
    }


def _transcribe_with_sarvam(
    tmp_path: str,
    language_hint: str,
    mode: str,
    model: str,
) -> dict:
    api_key = os.getenv("SARVAM_API_KEY")
    if not api_key:
        raise ValueError("SARVAM_API_KEY is not configured.")

    sarvam = SarvamAI(api_subscription_key=api_key)
    language_code = _sarvam_language_code(language_hint)

    with open(tmp_path, "rb") as audio_file:
        response = sarvam.speech_to_text.transcribe(
            file=audio_file,
            model=model,
            mode=mode,
            language_code=language_code,
            input_audio_codec="wav",
        )

    confidence = response.language_probability if response.language_probability else 0.9
    return {
        "transcript": (response.transcript or "").strip(),
        "language": response.language_code or language_code,
        "confidence": round(float(confidence), 2),
        "provider": "sarvam",
    }


async def transcribe_audio(
    audio_bytes: bytes,
    filename: str = "audio.wav",
    stt_provider: str = "whisper",
    language_hint: str = "en",
    stt_mode: str = "transcribe",
    stt_model: str = "saaras:v3",
) -> dict:
    ext = os.path.splitext(filename)[1] or ".wav"
    provider = _normalize_provider(stt_provider)

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp_file:
        tmp_file.write(audio_bytes)
        tmp_path = tmp_file.name

    try:
        if provider == "sarvam":
            return await asyncio.to_thread(
                _transcribe_with_sarvam,
                tmp_path,
                language_hint,
                stt_mode,
                stt_model,
            )

        return await asyncio.to_thread(_transcribe_with_whisper, tmp_path, language_hint)
    finally:
        os.unlink(tmp_path)
