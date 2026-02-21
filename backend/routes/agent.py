from fastapi import APIRouter
from services.gemini import chat_agent
from models.schema import AgentMessage, AgentResponse


router = APIRouter()

@router.post("/chat", response_model=AgentResponse)
async def chat(req: AgentMessage):
    reply = await chat_agent(
        message=req.message,
        patient_context=req.patient_id or "no patient selected",
        history=req.conversation_history
    )
    return AgentResponse(reply=reply)