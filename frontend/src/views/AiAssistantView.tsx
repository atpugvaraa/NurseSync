import { ArrowRight, Bot, CalendarDays, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";

export default function AIAssistantView() {
  const navigate = useNavigate();
  const { selectedPatient } = useAppState();

  return (
    <div className="screen-wrapper" style={{ background: "#eef4f5" }}>
      <header className="screen-header">
        <div>
          <h1 className="screen-title">NurseSync AI</h1>
          <p className="screen-subtitle">Smart Assistant</p>
        </div>
        <div className="h-11 w-11 rounded-full border border-teal-200 bg-white grid place-items-center text-teal-600">
          <Bot size={20} strokeWidth={2.4} />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-teal-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
          <UserRound size={14} strokeWidth={2.3} />
          {selectedPatient.name}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-teal-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
          <CalendarDays size={14} strokeWidth={2.3} />
          Room {selectedPatient.room}
        </span>
      </div>

      <section className="card mt-4 p-4">
        <p className="text-sm text-teal-700">NurseSync AI • 09:41 AM</p>
        <p className="mt-3 text-3xl font-black leading-snug text-slate-900">
          Fever spike of <span className="text-teal-600">101.2°F</span> at 02:00
          AM detected.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Would you like a vitals trend review or to generate a handoff-ready
          summary?
        </p>
      </section>

      <section className="card mt-4 p-4">
        <p className="section-title">Quick Actions</p>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left font-semibold text-slate-800">
            Check Lab Results
          </button>
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left font-semibold text-slate-800">
            Schedule Follow-up
          </button>
          <button
            type="button"
            onClick={() => navigate("/discharge-summary")}
            className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-left font-semibold text-teal-800"
          >
            Shift Summary
            <ArrowRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </section>
    </div>
  );
}
