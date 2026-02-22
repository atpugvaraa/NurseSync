export interface Patient {
  id: string;
  name: string;
  ward: string;
  prescription: unknown | null;
  created_at?: string;
}

export interface PatientListResponse {
  patients: Patient[];
}

export interface StructuredLog {
  patient_name: string | null;
  action_type: string;
  medication: string | null;
  dose: string | null;
  time_mentioned: string | null;
  notes: string | null;
  priority: string;
  matched_prescription: boolean;
  confidence?: number;
}

export interface LogRecord {
  id: string;
  patient_id: string;
  nurse_id: string;
  raw_text: string;
  structured_log: StructuredLog;
  confidence: number;
  needs_review: boolean;
  created_at: string;
  shift_id: string | null;
}

export interface CreateLogResponse {
  raw_transcript: string;
  clean_transcript: string;
  confidence: number;
  needs_review: boolean;
  structured_log: StructuredLog;
  saved: LogRecord;
}

export interface PatientLogsResponse {
  logs: LogRecord[];
  count: number;
}

export interface Shift {
  id: string;
  nurse_id: string;
  status: string;
  created_at?: string;
}

export interface StartShiftResponse {
  shift: Shift;
  message: string;
}

export interface HandoffRecord {
  id: string;
  outgoing_nurse_id: string;
  incoming_nurse_id: string | null;
  shift_id: string;
  summary_text: string;
  audio_url: string | null;
  pending_tasks: string[];
  high_priority: string[];
  status: string;
  created_at?: string;
}

export interface HandoffEmptyResponse {
  message: string;
}

export type HandoffIncomingResponse = HandoffRecord | HandoffEmptyResponse;

export interface HandoffEndResponse {
  handoff_id: string;
  summary: string;
  pending_tasks: string[];
  high_priority: string[];
  total_logs: number;
}

export interface HandoffEndErrorResponse {
  error: string;
}

export interface AcceptHandoffResponse {
  message: string;
  shift_id: string;
}

export interface AgentChatRequest {
  message: string;
  patient_id: string | null;
  conversation_history: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface AgentChatResponse {
  reply: string;
  sources?: unknown[];
}

export interface PrescriptionParseResponse {
  raw: string;
  filename: string;
}

export interface MedicationExtractionItem {
  medication?: string;
  name?: string;
  dose?: string;
  frequency?: string;
  instructions?: string;
  [key: string]: unknown;
}

export interface ShiftEndRequest {
  nurse_id: string;
  shift_id: string;
}

export interface StartShiftRequest {
  nurse_id: string;
}

export interface AcceptHandoffRequest {
  handoff_id: string;
  incoming_nurse_id: string;
}
