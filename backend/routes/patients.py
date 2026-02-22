from fastapi import APIRouter, UploadFile, File, Form
from services.db import save_prescription

router = APIRouter()

@router.post("/upload")
async def upload_prescription(
    file: UploadFile = File(...),
    patient_id: str = Form(...)
):
    content = await file.read()
    
    # save file to static folder
    import os
    os.makedirs("static/prescriptions", exist_ok=True)
    file_path = f"static/prescriptions/{patient_id}_{file.filename}"
    
    with open(file_path, "wb") as f:
        f.write(content)

    # save reference in DB
    saved = await save_prescription(
        patient_id=patient_id,
        file_url=f"/static/prescriptions/{patient_id}_{file.filename}",
        filename=file.filename
    )

    return {
        "message": "Prescription uploaded ✅",
        "file_url": f"/static/prescriptions/{patient_id}_{file.filename}",
        "saved": saved
    }

@router.get("/{patient_id}")
async def get_prescriptions(patient_id: str):
    from services.db import get_prescriptions_by_patient
    prescriptions = await get_prescriptions_by_patient(patient_id)
    return {"prescriptions": prescriptions}