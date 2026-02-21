from fastapi import APIRouter, UploadFile, File, Form
from services.stt import transcribe_audio
from services.gemini import extract_log
from services.db import save_log, get_logs

router = APIRouter()

@router.post("/create")
async def create_log_from_audio(
    audio: UploadFile = File(...),
    patient_id: str = Form(...),
    nurse_id: str = Form(...),
    shift_id: str = Form(...),
    prescription_context: str = Form(default="none")
):
    # step 1: whisper → raw text
    audio_bytes = await audio.read()
    stt_result = await transcribe_audio(audio_bytes, audio.filename)
    transcript = stt_result["transcript"]
    confidence = stt_result["confidence"]

    # step 2: gemini → structured log
    structured = await extract_log(transcript, prescription_context)
    needs_review = confidence < 0.75

    # step 3: save to supabase
    saved = await save_log(
        patient_id=patient_id,
        nurse_id=nurse_id,
        raw_text=transcript,
        structured_log=structured,
        confidence=confidence,
        needs_review=needs_review
    )

    return {
        "transcript": transcript,
        "confidence": confidence,
        "needs_review": needs_review,
        "structured_log": structured,
        "saved": saved
    }

@router.get("/patient/{patient_id}")
async def get_patient_logs(patient_id: str):
    logs = await get_logs(patient_id)
    return {"logs": logs, "count": len(logs)}

