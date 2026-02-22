import { ChevronLeft, FileText, Upload, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Prescription {
  id: string;
  filename: string;
  file_url: string;
  created_at: string;
}

export default function ScannerView() {
  const navigate = useNavigate();
  const { selectedPatient } = useAppState();

  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  // fetch existing prescriptions for this patient
  useEffect(() => {
    if (!selectedPatient?.id) return;
    axios
      .get(`${BASE_URL}/api/prescription/${selectedPatient.id}`)
      .then(({ data }) => setPrescriptions(data.prescriptions))
      .catch(() => {});
  }, [selectedPatient?.id]);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    // local preview
    setPreviewUrl(URL.createObjectURL(file));
    setFileType(file.type);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("patient_id", selectedPatient?.id ?? "none");

      const { data } = await axios.post(
        `${BASE_URL}/api/prescription/parse`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setFileName(data.filename);
      setFileUrl(data.file_url);

      console.log(fileName);
      console.log(fileUrl);


      // refresh prescription list
      if (selectedPatient?.id) {
        const updated = await axios.get(
          `${BASE_URL}/api/prescription/${selectedPatient.id}`,
        );
        setPrescriptions(updated.data.prescriptions);
      }
    } catch {
      setError("Failed to upload prescription.");
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
          className="h-11 w-11 rounded-full border border-[var(--border-subtle)] bg-white grid place-items-center shadow-sm transition-transform hover:scale-[1.02]"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <div className="flex-1 pl-3">
          <p className="section-title">Prescription Scanner</p>
          <h1 className="screen-title text-[var(--text-primary)]">
            {selectedPatient?.name ?? "No patient selected"}
          </h1>
        </div>
      </header>

      {/* upload */}
      <section className="glass-panel p-5">
        <div className="rounded-2xl border border-dashed border-[var(--primary)] bg-white/50 p-8 text-center shadow-inner">
          <Upload
            size={32}
            className="mx-auto mb-3"
            style={{ color: "var(--primary)" }}
          />
          <p className="text-sm font-bold text-[var(--primary)]">
            Upload prescription image or PDF
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            JPG, PNG, PDF supported
          </p>

          <label
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <Upload size={14} strokeWidth={2.4} />
            Select File
            <input
              type="file"
              accept="image/*,application/pdf"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileUpload(file);
              }}
            />
          </label>
          {loading && (
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Uploading...
            </p>
          )}
        </div>
      </section>

      {error && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </section>
      )}

      {/* local preview */}
      {previewUrl && (
        <section className="glass-panel p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">
            Preview
          </p>
          {fileType === "application/pdf" ? (
            <iframe
              src={previewUrl}
              className="w-full rounded-2xl border border-[var(--border-subtle)]"
              style={{ height: "400px" }}
            />
          ) : (
            <img
              src={previewUrl}
              alt="Prescription"
              className="w-full rounded-2xl border border-[var(--border-subtle)] object-contain"
              style={{ maxHeight: "400px" }}
            />
          )}
        </section>
      )}

      {/* all prescriptions for this patient */}
      {prescriptions.length > 0 && (
        <section className="glass-panel p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">
            All Prescriptions
          </p>
          <div className="flex flex-col gap-2">
            {prescriptions.map((p) => (
              <a
                key={p.id}
                href={p.file_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-white p-4 transition-transform hover:scale-[1.01]"
              >
                <div
                  className="h-10 w-10 rounded-xl grid place-items-center"
                  style={{ backgroundColor: "var(--bg-glass)" }}
                >
                  <FileText size={20} style={{ color: "var(--primary)" }} />
                </div>

                <div className="flex-1">
                  <p className="font-bold text-sm text-[var(--text-primary)]">
                    {p.filename}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>

                <ExternalLink
                  size={16}
                  style={{ color: "var(--text-muted)" }}
                />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
