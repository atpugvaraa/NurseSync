import type {
  HandoffIncomingResponse,
  HandoffRecord,
  MedicationExtractionItem,
  StructuredLog,
} from "./types";

const ENTITY_LABELS = {
  medication: "Medication",
  vitals: "Vitals",
  dressing: "Procedure",
  observation: "Observation",
  note: "Note",
} as const;

export function toConfidencePercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 1) return Math.max(0, Math.min(100, value * 100));
  return Math.max(0, Math.min(100, value));
}

export function deriveEntityChips(structured: StructuredLog | null): string[] {
  if (!structured) return [];

  const chips = new Set<string>();
  const normalizedAction = structured.action_type.toLowerCase();
  const mapped = ENTITY_LABELS[normalizedAction as keyof typeof ENTITY_LABELS];

  if (mapped) chips.add(mapped);
  if (structured.medication) chips.add("Medication");
  if (structured.time_mentioned || normalizedAction === "vitals") chips.add("Vitals");
  if (normalizedAction === "dressing") chips.add("Procedure");
  if (!chips.size) chips.add("Note");

  return Array.from(chips);
}

export function isPendingHandoff(
  response: HandoffIncomingResponse,
): response is HandoffRecord {
  return typeof response === "object" && response !== null && "id" in response;
}

export function safeParsePrescriptionRaw(raw: string): {
  items: MedicationExtractionItem[];
  parseError: string | null;
} {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      const items = parsed.filter(
        (item): item is MedicationExtractionItem =>
          typeof item === "object" && item !== null,
      );
      return { items, parseError: null };
    }

    return {
      items: [],
      parseError: "Prescription parser returned non-array JSON.",
    };
  } catch {
    return {
      items: [],
      parseError: "Prescription parser returned plain text instead of JSON.",
    };
  }
}
