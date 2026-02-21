from fastapi import APIRouter
from services.db import get_all_patients, get_patient_by_id

router = APIRouter()

@router.get("/")
async def list_patients():
    patients = await get_all_patients()
    return {"patients": patients}

@router.get("/{patient_id}")
async def get_patient(patient_id: str):
    patient = await get_patient_by_id(patient_id)
    return patient