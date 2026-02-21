from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import handoff, agent, prescription, logs, patients
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="NurseSync API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1420", "http://localhost:3000", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(handoff.router, prefix="/api/handoff", tags=["Handoff"])
app.include_router(agent.router, prefix="/api/agent", tags=["Agent"])
app.include_router(prescription.router, prefix="/api/prescription", tags=["Prescription"])
app.include_router(logs.router, prefix="/api/logs", tags=["Logs"])
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])

@app.get("/health")
def health(): return {"status": "NurseSync is live 🚀"}