from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.mega_llm import chat_agent
from services.db import get_patient_by_id

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    patient_id: Optional[str] = None
    conversation_history: list = []

@router.post("/chat")
async def chat(req: ChatRequest):
    # get patient context if patient_id provided
    patient_context = "none"
    if req.patient_id:
        try:
            patient = await get_patient_by_id(req.patient_id)
            patient_context = f"{patient['name']} in {patient['ward']}"
        except:
            patient_context = "none"

    reply = await chat_agent(
        message=req.message,
        patient_context=patient_context,
        history=req.conversation_history
    )

    return {
        "reply": reply,
        "history": req.conversation_history + [
            {"role": "user", "content": req.message},
            {"role": "assistant", "content": reply}
        ]
    }