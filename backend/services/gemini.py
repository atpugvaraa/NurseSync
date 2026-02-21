from config import MODEL
from langchain_core.messages import HumanMessage
import json

LOG_EXTRACTION_PROMPT = """You are a clinical log extractor for nurses.
Given a nurse's voice note transcript, extract structured data.
Return ONLY valid JSON, nothing else, no markdown.

{{
  "patient_name": "string or null",
  "action_type": "medication|vitals|dressing|observation|note",
  "medication": "string or null",
  "dose": "string or null",
  "time_mentioned": "string or null",
  "notes": "any additional observations",
  "priority": "high|medium|low",
  "matched_prescription": false,
  "confidence": 0.95
}}

Transcript: {transcript}
Prescription context: {prescription}"""

async def extract_log(transcript: str, prescription: str = "none") -> dict:
    prompt = LOG_EXTRACTION_PROMPT.format(
        transcript=transcript,
        prescription=prescription
    )
    response = MODEL.invoke([HumanMessage(content=prompt)])
    text = response.content.strip().replace("```json", "").replace("```", "")
    return json.loads(text)

async def generate_handoff(logs: list) -> dict:
    prompt = f"""Summarize this nurse shift for handoff. Return ONLY valid JSON.
{{"summary": "text", "pending_tasks": [], "high_priority": []}}
Logs: {json.dumps(logs)}"""
    response = MODEL.invoke([HumanMessage(content=prompt)])
    text = response.content.strip().replace("```json", "").replace("```", "")
    return json.loads(text)

async def chat_agent(message: str, patient_context: str, history: list) -> str:
    prompt = f"""You are NurseSync AI assistant helping nurses.
Be concise. Always recommend consulting a doctor for critical decisions.
Patient context: {patient_context}
History: {history}
Nurse asks: {message}"""
    response = MODEL.invoke([HumanMessage(content=prompt)])
    return response.content

async def clean_transcript(raw_transcript: str) -> str:
    prompt = f"""You are a medical transcription corrector for nurses.
Fix spelling, grammar, and especially medical terms like:
- medication names (paracetamol, ibuprofen, amoxicillin etc.)
- dosages (10mg, 500mg etc.)
- medical procedures (dressing, IV, catheter etc.)
- patient names

Return ONLY the corrected transcript text, nothing else, no explanation.

Raw transcript: {raw_transcript}"""
    
    response = MODEL.invoke([HumanMessage(content=prompt)])
    return response.content.strip()