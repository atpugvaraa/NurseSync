from fastapi import APIRouter, UploadFile, File
from config import MODEL
import os, base64

router = APIRouter()

@router.post("/parse")
async def parse_prescription(file: UploadFile = File(...)):
    content = await file.read()
    b64 = base64.b64encode(content).decode()
    
    response = MODEL.generate_content([
        {"mime_type": file.content_type, "data": b64},
        "Extract all medications, doses, frequency, and instructions from this prescription. Return as JSON array."
    ])
    
    return {"raw": response.text, "filename": file.filename}