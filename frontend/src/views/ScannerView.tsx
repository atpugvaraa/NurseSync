import { ChevronLeft, ScanLine, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parsePrescription } from "../api/client";
import { safeParsePrescriptionRaw } from "../api/mappers";
import type { MedicationExtractionItem } from "../api/types";
import { useAppState } from "../state/AppStateContext";

export default function ScannerView() {
  const navigate = useNavigate();
  const {
    selectedPatient,
    prescriptionContext,
    setPrescriptionContext,
    clearPrescriptionContext,
  } = useAppState();

  const [items, setItems] = useState<MedicationExtractionItem[]>([]);
  const [rawText, setRawText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setParseError(null);

    try {
      const response = await parsePrescription(file);
      const parsed = safeParsePrescriptionRaw(response.raw);

      setRawText(response.raw);
      setItems(parsed.items);
      setParseError(parsed.parseError);
      setFileName(response.filename);

      if (parsed.items.length > 0) {
        setPrescriptionContext(JSON.stringify(parsed.items));
      } else {
        setPrescriptionContext(response.raw);
      }
    } catch {
      setParseError("Failed to parse prescription image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-wrapper text-[var(--text-primary)] bg-[var(--surface-bg)]">
      <header className="screen-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-11 w-11 rounded-full border border-[var(--border-subtle)] bg-white grid place-items-center text-[var(--text-primary)] shadow-sm transition-transform hover:scale-[1.02]"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <div className="flex-1 pl-3">
          <p className="section-title">Prescription Scanner</p>
          <h1 className="screen-title text-[var(--text-primary)]">{selectedPatient?.name ?? "No patient selected"}</h1>
        </div>
      </header>

      <section className="glass-panel p-5">
        <div className="rounded-2xl border border-dashed border-[var(--primary)] bg-white/50 p-6 text-center shadow-inner">
          <p className="text-sm font-bold text-[var(--primary)]">
            Upload prescription image or capture from camera.
          </p>

          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md" style={{ backgroundColor: "var(--primary)" }}>
            <Upload size={14} strokeWidth={2.4} />
            Select File
            <input
              type="file"
              accept="image/*,application/pdf"
              capture="environment"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleFileUpload(file);
                }
              }}
            />
          </label>

          {loading && <p className="mt-3 text-sm font-medium text-[var(--text-muted)]">Parsing prescription...</p>}
          {fileName && <p className="mt-2 text-xs font-medium text-[var(--text-muted)]">Last uploaded: {fileName}</p>}
        </div>
      </section>

      <section className="glass-panel mt-5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Review Extraction</h2>
          <span className="rounded-full px-3 py-1.5 text-[10px] font-bold whitespace-nowrap shadow-sm uppercase tracking-widest" style={{ backgroundColor: items.length > 0 ? "white" : "var(--bg-glass)", color: items.length > 0 ? "var(--primary-contrast)" : "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>
            {items.length > 0 ? "Verified" : "Awaiting Parse"}
          </span>
        </div>

        {parseError && (
          <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">
            {parseError}
          </p>
        )}

        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item, index) => (
              <article
                key={`med-${index}`}
                className="rounded-[20px] bg-white p-5 shadow-sm border transition-transform hover:-translate-y-1"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <p className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  {(item.medication as string | undefined) ||
                    (item.name as string | undefined) ||
                    "Medication"}
                </p>
                <p className="mt-1 text-[13px] font-bold text-[var(--primary)]">
                  {(item.dose as string | undefined) || "Dose not provided"}
                  {(item.frequency as string | undefined)
                    ? ` • ${item.frequency as string}`
                    : ""}
                </p>
                {(item.instructions as string | undefined) && (
                  <p className="mt-2 text-[14px] font-medium text-[var(--text-primary)] leading-relaxed">{item.instructions as string}</p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <article className="rounded-[20px] bg-white p-5 border text-center" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-[14px] font-medium text-[var(--text-muted)]">
              {rawText || "No extraction yet. Upload a prescription to parse details."}
            </p>
          </article>
        )}

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              clearPrescriptionContext();
              setItems([]);
              setRawText("");
              setParseError(null);
              setFileName(null);
            }}
            className="rounded-full border border-[var(--border-subtle)] bg-white px-5 py-3.5 text-sm font-bold text-[var(--text-primary)] transition-transform hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            Clear Context
          </button>
          <button
            type="button"
            onClick={() => navigate("/voice-log")}
            className="flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] shadow-sm hover:shadow-md"
            style={{ backgroundColor: "var(--primary-contrast)" }}
          >
            <ScanLine size={16} strokeWidth={2.5} />
            Use in Voice Log
          </button>
        </div>
      </section>

      <section className="glass-panel mt-5 p-5">
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Current Prescription Context</p>
        <p className="mt-2 text-[14px] font-medium text-[var(--text-muted)]">
          {prescriptionContext === "none"
            ? "No context attached to voice logs yet."
            : "Parsed prescription context is attached for next recordings."}
        </p>
      </section>
    </div>
  );
}
