import { CircleCheck, Search, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";

export default function TaskManagerView() {
  const navigate = useNavigate();
  const { tasks, toggleTask } = useAppState();

  const urgentCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="screen-wrapper" style={{ background: "#eef4f5" }}>
      <header className="screen-header">
        <div>
          <h1 className="screen-title">Task Manager</h1>
          <p className="screen-subtitle">AI Prioritized • Morning Shift</p>
        </div>
        <button className="h-11 w-11 rounded-full border border-teal-200 bg-white grid place-items-center text-teal-600">
          <Search size={20} strokeWidth={2.4} />
        </button>
      </header>

      <section className="card p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl border border-teal-100 bg-white px-3 py-3">
            <p className="text-3xl font-black text-slate-900">{urgentCount}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Urgent</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-3xl font-black text-slate-600">12</p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Today</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-3xl font-black text-slate-600">84%</p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Stats</p>
          </div>
        </div>
      </section>

      <p className="mt-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-teal-800">
        <TriangleAlert size={16} strokeWidth={2.5} />
        Overdue - High Risk
      </p>

      <section className="mt-3 space-y-3">
        {tasks.map((task) => (
          <article key={task.id} className="card border-l-4 border-l-teal-500 p-4">
            <p className="text-sm font-black text-rose-500">
              {task.completed ? "Completed" : `${task.overdueMinutes}m Overdue`} • {task.ward.toUpperCase()}
            </p>
            <h2 className="mt-1 text-3xl font-black leading-tight text-slate-900">{task.title}</h2>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white"
              >
                <CircleCheck size={15} strokeWidth={2.5} />
                {task.completed ? "Undo" : "Log Task"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/patients")}
                className="rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700"
              >
                DETAILS
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
