from fastapi import APIRouter, UploadFile, File, Form
from services.stt import transcribe_audio
from services.gemini import extract_log
from services.db import save_log, get_logs
from services.mega_llm import clean_transcript

router = APIRouter()

@router.post("/create")
async def create_log_from_audio(
    audio: UploadFile = File(...),
    patient_id: str = Form(...),
    nurse_id: str = Form(...),
    shift_id: str = Form(...),
    prescription_context: str = Form(default="none"),
    stt_provider: str = Form(default="whisper"),
    stt_language: str = Form(default="en"),
    stt_mode: str = Form(default="transcribe"),
    stt_model: str = Form(default="saaras:v3"),
):
    audio_bytes = await audio.read()

    # step 1: whisper → raw transcript
    stt_result = await transcribe_audio(
        audio_bytes,
        audio.filename,
        stt_provider=stt_provider,
        language_hint=stt_language,
        stt_mode=stt_mode,
        stt_model=stt_model,
    )
    raw_transcript = stt_result["transcript"]
    confidence = stt_result["confidence"]

    # step 2: megallm cleans transcript
    clean = await clean_transcript(raw_transcript)

    # step 3: gemini extracts structured log
    structured = await extract_log(clean, prescription_context)
    needs_review = confidence < 0.75

    # step 4: save
    saved = await save_log(
        patient_id=patient_id,
        nurse_id=nurse_id,
        shift_id=shift_id,
        raw_text=clean,
        structured_log=structured,
        confidence=confidence,
        needs_review=needs_review
    )

    return {
        "raw_transcript": raw_transcript,
        "clean_transcript": clean,
        "confidence": confidence,
        "needs_review": needs_review,
        "structured_log": structured,
        "saved": saved,
        "stt_provider": stt_result.get("provider", stt_provider),
        "stt_detected_language": stt_result.get("language", stt_language),
        "stt_requested_language": stt_language,
    }
    
@router.get("/patient/{patient_id}")
async def get_patient_logs(patient_id: str):
    logs = await get_logs(patient_id)
    return {"logs": logs, "count": len(logs)}
