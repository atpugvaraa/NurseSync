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
- patient names
Return ONLY the corrected transcript, nothing else."""
            },
            {
                "role": "user",
                "content": f"Fix this nurse transcript: {raw_transcript}"
            }
        ]
    )
    return response.choices[0].message.content.strip()