from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key=os.getenv("MEGALLM_API_KEY")
)

async def clean_transcript(raw_transcript: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # check megallm docs for available models
        messages=[
            {
                "role": "system",
                "content": """You are a medical transcription corrector for nurses.
Fix spelling, grammar, and especially medical terms like:
- medication names (paracetamol, ibuprofen, amoxicillin etc.)
- dosages (10mg, 500mg etc.)
- medical procedures (dressing, IV, catheter etc.)
- patient names(can be indian or foreign names so be carefull about them check common names that like ishan, aryan, arnav, anshuman, laksh, daksh, etc)
Return ONLY the corrected transcript, nothing else."""
            },
            {
                "role": "user",
                "content": f"Fix this nurse transcript: {raw_transcript}"
            }
        ]
    )
    return response.choices[0].message.content.strip()


async def chat_agent(message: str, patient_context: str, history: list) -> str:
    messages = [
        {
            "role": "system",
            "content": """You are NurseSync AI, a clinical assistant for nurses.
Answer questions about medications, procedures, and patient care concisely.
Always recommend consulting a doctor for critical decisions.
Patient context: """ + patient_context
        }
    ]

    # add conversation history
    for msg in history:
        messages.append(msg)

    # add current message
    messages.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    content = response.choices[0].message.content
    if not content:
        return "Sorry, I couldn't process that. Please try again."
    return content.strip()