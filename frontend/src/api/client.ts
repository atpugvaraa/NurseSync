import axios from "axios";
import type {
  AcceptHandoffRequest,
  AcceptHandoffResponse,
  AgentChatRequest,
  AgentChatResponse,
  CreateLogResponse,
  HandoffIncomingResponse,
  HandoffEndErrorResponse,
  HandoffEndResponse,
  Patient,
  PatientListResponse,
  PatientLogsResponse,
  PrescriptionParseResponse,
  ShiftEndRequest,
  StartShiftRequest,
  StartShiftResponse,
} from "./types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export async function listPatients(): Promise<PatientListResponse> {
  const { data } = await api.get<PatientListResponse>("/api/patients/");
  return data;
}

export async function getPatientById(patientId: string): Promise<Patient> {
  const { data } = await api.get<Patient>(`/api/patients/${patientId}`);
  return data;
}

export async function startShift(
  payload: StartShiftRequest,
): Promise<StartShiftResponse> {
  const { data } = await api.post<StartShiftResponse>(
    "/api/handoff/shift/start",
    payload,
  );
  return data;
}

export async function endShift(
  payload: ShiftEndRequest,
): Promise<HandoffEndResponse | HandoffEndErrorResponse> {
  const { data } = await api.post<HandoffEndResponse | HandoffEndErrorResponse>(
    "/api/handoff/shift/end",
    payload,
  );
  return data;
}

export async function getIncomingHandoff(): Promise<HandoffIncomingResponse> {
  const { data } = await api.get<HandoffIncomingResponse>("/api/handoff/incoming");
  return data;
}

export async function acceptIncomingHandoff(
  payload: AcceptHandoffRequest,
): Promise<AcceptHandoffResponse> {
  const { data } = await api.post<AcceptHandoffResponse>(
    "/api/handoff/accept",
    payload,
  );
  return data;
}

export async function chatWithAgent(
  payload: AgentChatRequest,
): Promise<AgentChatResponse> {
  const { data } = await api.post<AgentChatResponse>("/api/agent/chat", payload);
  return data;
}

export async function parsePrescription(
  file: File,
): Promise<PrescriptionParseResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<PrescriptionParseResponse>(
    "/api/prescription/parse",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function createLogFromAudio(params: {
  audio: Blob;
  patientId: string;
  nurseId: string;
  shiftId: string;
  prescriptionContext?: string;
  sttProvider?: string;
  sttLanguage?: string;
  sttMode?: string;
  sttModel?: string;
}): Promise<CreateLogResponse> {
  const formData = new FormData();
  formData.append("audio", params.audio, "recording.wav");
  formData.append("patient_id", params.patientId);
  formData.append("nurse_id", params.nurseId);
  formData.append("shift_id", params.shiftId);
  formData.append("prescription_context", params.prescriptionContext ?? "none");
  formData.append("stt_provider", params.sttProvider ?? "whisper");
  formData.append("stt_language", params.sttLanguage ?? "en");
  formData.append("stt_mode", params.sttMode ?? "transcribe");
  formData.append("stt_model", params.sttModel ?? "saaras:v3");

  const { data } = await api.post<CreateLogResponse>("/api/logs/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getLogsByPatient(
  patientId: string,
): Promise<PatientLogsResponse> {
  const { data } = await api.get<PatientLogsResponse>(`/api/logs/patient/${patientId}`);
  return data;
}
