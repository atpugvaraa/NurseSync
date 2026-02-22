import { CircleCheck, Search, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";

export default function TaskManagerView() {
  const navigate = useNavigate();
  const { tasks, toggleTask } = useAppState();

  const urgentCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="screen-wrapper text-[var(--text-primary)] bg-[var(--surface-bg)]">
      <header className="screen-header flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">Task Manager</h1>
          <p className="screen-subtitle text-[var(--text-muted)] mt-0.5">AI Prioritized • Morning Shift</p>
        </div>
        <button className="h-11 w-11 rounded-full border border-[var(--border-subtle)] bg-white grid place-items-center text-[var(--text-primary)] shadow-sm transition-transform hover:scale-[1.02]">
          <Search size={20} strokeWidth={2.4} />
        </button>
      </header>

      <section className="glass-panel p-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-[20px] bg-white border px-4 py-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{urgentCount}</p>
            <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--primary-contrast)" }}>Urgent</p>
          </div>
          <div className="rounded-[20px] bg-[var(--surface-bg)] border px-4 py-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-3xl font-bold text-[var(--text-muted)] tracking-tight">12</p>
            <p className="text-[11px] font-bold uppercase tracking-widest mt-1 text-[var(--text-muted)]">Today</p>
          </div>
          <div className="rounded-[20px] bg-[var(--surface-bg)] border px-4 py-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-3xl font-bold text-[var(--text-muted)] tracking-tight">84%</p>
            <p className="text-[11px] font-bold uppercase tracking-widest mt-1 text-[var(--text-muted)]">Stats</p>
          </div>
        </div>
      </section>

      <div className="mt-5 flex items-center gap-2">
        <TriangleAlert size={18} strokeWidth={2.5} style={{ color: "var(--primary-contrast)" }} />
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Overdue - High Risk
        </p>
      </div>

      <section className="mt-4 space-y-4 pb-6">
        {tasks.map((task) => (
          <article key={task.id} className="glass-panel border-l-4 p-5 hover:-translate-y-1 transition-transform" style={{ borderLeftColor: task.completed ? "var(--border-subtle)" : "var(--primary)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: task.completed ? "var(--text-muted)" : "var(--primary-contrast)" }}>
              {task.completed ? "Completed" : `${task.overdueMinutes}m Overdue`} • {task.ward}
            </p>
            <h2 className="mt-2 text-xl font-bold leading-tight text-[var(--text-primary)] tracking-tight">{task.title}</h2>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-bold text-white shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md"
                style={{ backgroundColor: task.completed ? "var(--text-muted)" : "var(--primary)" }}
              >
                <CircleCheck size={18} strokeWidth={2.5} />
                {task.completed ? "Undo" : "Log Task"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/patients")}
                className="flex-1 rounded-full border px-5 py-3 text-[14px] font-bold shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md uppercase tracking-wider bg-white"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
              >
                Details
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
