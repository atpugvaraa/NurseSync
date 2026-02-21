import { ChevronLeft, Flashlight, ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";

export default function ScannerView() {
  const navigate = useNavigate();
  const { selectedPatient } = useAppState();

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
          <p className="section-title">Scanning Patient</p>
          <h1 className="screen-title">{selectedPatient.name}</h1>
        </div>
        <button className="h-11 w-11 rounded-full border border-teal-200 bg-teal-50 grid place-items-center text-teal-700">
          <Flashlight size={20} strokeWidth={2.4} />
        </button>
      </header>

      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0b1a3a] p-5 text-white">
        <p className="mx-auto max-w-max rounded-full border border-cyan-200/30 px-6 py-2 text-lg font-black tracking-wide">
          ALIGN PRESCRIPTION IN FRAME
        </p>
        <div className="mt-5 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-4 text-center">
          <p className="inline-block rounded-full bg-cyan-500/70 px-4 py-1 text-sm font-bold">
            Amoxicillin detected
          </p>
          <p className="mt-2 inline-block rounded-full bg-cyan-500/70 px-4 py-1 text-sm font-bold">
            500mg extraction
          </p>
        </div>
      </section>

      <section className="card mt-4 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-4xl font-black text-slate-900">
            Review Extraction
          </h2>
          <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            AI VERIFIED
          </span>
        </div>

        <article className="rounded-2xl border border-slate-200 p-4">
          <p className="text-3xl font-black text-slate-900">
            Amoxicillin (Antibiotic)
          </p>
          <p className="mt-1 text-lg font-bold text-cyan-700">
            500mg • 3x Daily
          </p>
          <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
            Allergy Alert: Patient EHR lists Penicillin allergy. High risk of
            cross-reactivity.
          </p>
        </article>

        <button
          type="button"
          onClick={() => navigate("/discharge-summary")}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-4 text-lg font-black text-white"
        >
          <ScanLine size={18} strokeWidth={2.5} />
          Log to EHR
        </button>
      </section>
    </div>
  );
}
