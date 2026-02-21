from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AudioLogResponse(BaseModel):
    transcript: str
    confidence: float
    needs_review: bool
    log: dict
    
class StructuredLog(BaseModel):
    doctor_name: str
    patient_name: str
    action_type: str        # medication | vitals | dressing | note
    medication: Optional[str]
    dose: Optional[str]
    time_mentioned: Optional[str]
    notes: Optional[str]
    matched_prescription: bool
    priority: str           # high | medium | low

class HandoffSummary(BaseModel):
    shift_id: str
    summary_text: str
    audio_url: Optional[str]
    pending_tasks: list
    high_priority: list

class AgentMessage(BaseModel):
    message: str
    patient_id: Optional[str]
    conversation_history: Optional[list] = []

class AgentResponse(BaseModel):
    reply: str
    sources: Optional[list] = []