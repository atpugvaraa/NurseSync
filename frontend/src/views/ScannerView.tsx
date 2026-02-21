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
    <div className="screen-wrapper" style={{ background: "#f4f5f6" }}>
      <header className="screen-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-11 w-11 rounded-full border border-slate-300 bg-white grid place-items-center text-slate-600"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <div className="flex-1 pl-3">
          <p className="section-title">Prescription Scanner</p>
          <h1 className="screen-title">{selectedPatient?.name ?? "No patient selected"}</h1>
        </div>
      </header>

      <section className="card p-5">
        <div className="rounded-2xl border border-dashed border-teal-300 bg-teal-50/70 p-5 text-center">
          <p className="text-sm font-semibold text-slate-700">
            Upload prescription image or capture from camera.
          </p>

          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white">
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

          {loading && <p className="mt-3 text-sm text-slate-500">Parsing prescription...</p>}
          {fileName && <p className="mt-2 text-xs text-slate-500">Last uploaded: {fileName}</p>}
        </div>
      </section>

      <section className="card mt-4 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-3xl font-black text-slate-900">Review Extraction</h2>
          <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            {items.length > 0 ? "AI VERIFIED" : "AWAITING PARSE"}
          </span>
        </div>

        {parseError && (
          <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-700">
            {parseError}
          </p>
        )}

        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item, index) => (
              <article
                key={`med-${index}`}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-xl font-black text-slate-900">
                  {(item.medication as string | undefined) ||
                    (item.name as string | undefined) ||
                    "Medication"}
                </p>
                <p className="mt-1 text-sm font-bold text-cyan-700">
                  {(item.dose as string | undefined) || "Dose not provided"}
                  {(item.frequency as string | undefined)
                    ? ` • ${item.frequency as string}`
                    : ""}
                </p>
                {(item.instructions as string | undefined) && (
                  <p className="mt-2 text-sm text-slate-700">{item.instructions as string}</p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-700">
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
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700"
          >
            Clear Context
          </button>
          <button
            type="button"
            onClick={() => navigate("/voice-log")}
            className="flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-3 text-sm font-black text-white"
          >
            <ScanLine size={16} strokeWidth={2.5} />
            Use in Voice Log
          </button>
        </div>
      </section>

      <section className="card mt-4 p-4">
        <p className="section-title">Current Prescription Context</p>
        <p className="mt-2 text-sm text-slate-600">
          {prescriptionContext === "none"
            ? "No context attached to voice logs yet."
            : "Parsed prescription context is attached for next recordings."}
        </p>
      </section>
    </div>
  );
}
