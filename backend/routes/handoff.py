from fastapi import APIRouter
from pydantic import BaseModel
from services.db import (
    get_logs_by_shift, save_handoff,
    get_pending_handoff, accept_handoff,
    update_shift_status, start_shift
)
from services.gemini import generate_handoff

router = APIRouter()

class StartShiftRequest(BaseModel):
    nurse_id: str

class EndShiftRequest(BaseModel):
    nurse_id: str
    shift_id: str

class AcceptHandoffRequest(BaseModel):
    handoff_id: str
    incoming_nurse_id: str

@router.post("/shift/start")
async def start_new_shift(req: StartShiftRequest):
    shift = await start_shift(req.nurse_id)
    return {"shift": shift, "message": "Shift started ✅"}

@router.post("/shift/end")
async def end_shift(req: EndShiftRequest):
    # get all logs from this shift
    logs = await get_logs_by_shift(req.shift_id)

    if not logs:
        return {"error": "No logs found for this shift"}

    # gemini summarizes everything
    summary = await generate_handoff(logs)

    # save handoff
    handoff = await save_handoff(
        outgoing_nurse_id=req.nurse_id,
        shift_id=req.shift_id,
        summary_text=summary["summary"],
        audio_url=None,
        pending_tasks=summary["pending_tasks"],
        high_priority=summary["high_priority"]
    )

    # close shift
    await update_shift_status(req.shift_id, "closed")

    return {
        "handoff_id": handoff["id"],
        "summary": summary["summary"],
        "pending_tasks": summary["pending_tasks"],
        "high_priority": summary["high_priority"],
        "total_logs": len(logs)
    }

@router.get("/incoming")
async def get_incoming_handoff():
    handoff = await get_pending_handoff()
    if not handoff:
        return {"message": "No pending handoff"}
    return handoff

@router.post("/accept")
async def accept_incoming_handoff(req: AcceptHandoffRequest):
    await accept_handoff(req.handoff_id, req.incoming_nurse_id)
    shift = await start_shift(req.incoming_nurse_id)
    return {
        "message": "Handoff accepted, shift started ✅",
        "shift_id": shift["id"]
    }