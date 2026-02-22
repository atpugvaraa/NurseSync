from fastapi import APIRouter, UploadFile, File, Form
from services.db import supabase
import uuid

router = APIRouter()

@router.post("/parse")
async def upload_prescription(
    file: UploadFile = File(...),
    patient_id: str = Form(default="none")
):
    content = await file.read()
    
    # unique filename so it never overwrites
    ext = file.filename.split(".")[-1]
    unique_name = f"{patient_id}/{uuid.uuid4()}.{ext}"
    
    # upload to supabase storage
    supabase.storage.from_("prescriptions").upload(
        path=unique_name,
        file=content,
        file_options={"content-type": file.content_type}
    )
    
    # get public URL
    public_url = supabase.storage.from_("prescriptions").get_public_url(unique_name)
    
    # save reference in DB
    supabase.table("prescriptions").insert({
        "patient_id": patient_id,
        "file_url": public_url,
        "filename": file.filename
    }).execute()

    return {
        "raw": "Prescription uploaded successfully",
        "filename": file.filename,
        "file_url": public_url
    }

@router.get("/{patient_id}")
async def get_prescriptions(patient_id: str):
    result = supabase.table("prescriptions")\
        .select("*")\
        .eq("patient_id", patient_id)\
        .order("created_at", desc=True)\
        .execute()
    return {"prescriptions": result.data}