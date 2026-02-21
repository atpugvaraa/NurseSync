from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

async def save_log(
    patient_id: str,
    nurse_id: str,
    raw_text: str,
    structured_log: dict,
    confidence: float,
    needs_review: bool
) -> dict:
    result = supabase.table("logs").insert({
        "patient_id": patient_id,
        "nurse_id": nurse_id,
        "raw_text": raw_text,
        "structured_log": structured_log,
        "confidence": confidence,
        "needs_review": needs_review
    }).execute()
    return result.data[0]

async def get_logs(patient_id: str) -> list:
    result = supabase.table("logs")\
        .select("*")\
        .eq("patient_id", patient_id)\
        .order("created_at", desc=True)\
        .execute()
    return result.data

async def start_shift(nurse_id: str):
    result = supabase.table("shifts").insert({
        "nurse_id": nurse_id,
        "status": "active"
    }).execute()
    return result.data[0]

async def get_logs_by_shift(shift_id: str) -> list:
    result = supabase.table("logs")\
        .select("*")\
        .eq("shift_id", shift_id)\
        .order("created_at", desc=False)\
        .execute()
    return result.data

async def update_shift_status(shift_id: str, status: str):
    supabase.table("shifts").update({"status": status})\
        .eq("id", shift_id).execute()

async def save_handoff(outgoing_nurse_id, shift_id, summary_text, audio_url, pending_tasks, high_priority):
    result = supabase.table("handoffs").insert({
        "outgoing_nurse_id": outgoing_nurse_id,
        "shift_id": shift_id,
        "summary_text": summary_text,
        "audio_url": audio_url,
        "pending_tasks": pending_tasks,
        "high_priority": high_priority,
        "status": "pending"
    }).execute()
    return result.data[0]

async def get_pending_handoff():
    result = supabase.table("handoffs")\
        .select("*")\
        .eq("status", "pending")\
        .order("created_at", desc=True)\
        .limit(1)\
        .execute()
    return result.data[0] if result.data else None

async def accept_handoff(handoff_id: str, incoming_nurse_id: str):
    supabase.table("handoffs").update({
        "incoming_nurse_id": incoming_nurse_id,
        "status": "accepted"
    }).eq("id", handoff_id).execute()