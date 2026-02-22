from fastapi import APIRouter
from pydantic import BaseModel
from services.mega_llm import chat_agent

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    patient_context: str = "none"
    conversation_history: list = []

@router.post("/chat")
async def chat(req: ChatRequest):
    reply = await chat_agent(
        message=req.message,
        patient_context=req.patient_context,
        history=req.conversation_history
    )
    return {
        "reply": reply,
        "history": req.conversation_history + [
            {"role": "user", "content": req.message},
            {"role": "assistant", "content": reply}
        ]
    }