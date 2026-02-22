import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Bell,
  Brain,
  ChevronDown,
  ClipboardCheck,
  Mic,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientSelector from "./PatientSelector";
import { deriveEntityChips } from "./api/mappers";
import { useAppState } from "./state/AppStateContext";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    tasks,
    selectedPatient,
    setSelectedPatient,
    latestVoiceLog,
    prescriptionContext,
  } = useAppState();

  const [showSelector, setShowSelector] = useState(false);

  const openTasks = tasks.filter((task) => !task.completed).length;
  const entityChips = useMemo(
    () => deriveEntityChips(latestVoiceLog?.structuredLog ?? null),
    [latestVoiceLog],
  );

  const stats = [
    {
      label: "Patients",
      value: "12",
      sub: "+2 today",
      icon: Users,
    },
    {
      label: "Open Tasks",
      value: String(openTasks),
      sub: "Needs attention",
      icon: ClipboardCheck,
    },
    {
      label: "Shift",
      value: "65%",
      sub: null,
      icon: Activity,
      progress: 65,
    },
  ];

  return (
    <div className="screen-wrapper">
      {/* ─── Header ─── */}
      <motion.header
        className="screen-header sticky top-0 z-10 py-2"
        style={{ backdropFilter: "blur(12px)" }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "rgba(140, 199, 161, 0.8)" }}
          >
            Evening Shift • ICU
          </p>
          <h1 className="mt-1 text-[1.5rem] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            NurseSync
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="h-10 w-10 rounded-full border bg-white/80 backdrop-blur-sm grid place-items-center shadow-sm transition-transform hover:scale-105"
            style={{ borderColor: "rgba(140, 199, 161, 0.12)", color: "var(--text-muted)" }}
          >
            <Search size={17} strokeWidth={2.2} />
          </button>
          <button
            className="relative h-10 w-10 rounded-full border bg-white/80 backdrop-blur-sm grid place-items-center shadow-sm transition-transform hover:scale-105"
            style={{ borderColor: "rgba(140, 199, 161, 0.12)", color: "var(--text-muted)" }}
          >
            <Bell size={17} strokeWidth={2.2} />
            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white"
              style={{ background: "rgba(140, 199, 161, 0.9)" }}
            />
          </button>
        </div>
      </motion.header>

      <main className="flex flex-col gap-5 pb-36">
        {/* ─── Stats Row ─── */}
        <section className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <motion.article
              key={stat.label}
              className="glass-panel p-4 flex flex-col"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <stat.icon size={13} strokeWidth={2.4} style={{ color: "#5AAF78" }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-soft)" }}>
                  {stat.label}
                </p>
              </div>
              <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {stat.value}
              </p>
              {stat.sub && (
                <p className="mt-1 text-[11px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {stat.sub}
                </p>
              )}
              {stat.progress !== undefined && (
                <div
                  className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
                  style={{ background: "rgba(140, 199, 161, 0.1)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "rgba(140, 199, 161, 0.6)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  />
                </div>
              )}
            </motion.article>
          ))}
        </section>

        {/* ─── Patient Selector ─── */}
        <motion.section
          className="glass-panel p-5"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <p className="section-title mb-3">Select Patient</p>
          <button
            type="button"
            onClick={() => setShowSelector((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl border bg-white/70 backdrop-blur-sm px-4 py-3 transition-all shadow-sm hover:shadow-md"
            style={{ borderColor: "rgba(140, 199, 161, 0.12)" }}
          >
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {selectedPatient ? selectedPatient.name : "Tap to choose a patient"}
            </span>
            <motion.div animate={{ rotate: showSelector ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown size={17} style={{ color: "var(--text-muted)" }} />
            </motion.div>
          </button>
          <AnimatePresence>
            {showSelector && (
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <PatientSelector
                  selectedId={selectedPatient?.id}
                  onSelect={(patient) => {
                    setSelectedPatient(patient);
                    setShowSelector(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ─── Voice Log Hero (Big Mic Button) ─── */}
        <motion.section
          className="dashboard-hero p-8 text-center rounded-[28px] overflow-hidden relative"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles size={14} strokeWidth={2.2} style={{ color: "#5AAF78" }} />
              <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                Voice Log Center
              </p>
            </div>

            <p className="text-lg font-bold tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
              {selectedPatient
                ? `Ready for ${selectedPatient.name}`
                : "Select a patient to begin"}
            </p>
            {selectedPatient && (
              <p className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
                {selectedPatient.ward}
              </p>
            )}

            <motion.button
              type="button"
              onClick={() => navigate("/voice-log")}
              disabled={!selectedPatient}
              className="hero-mic-button mt-8 relative outline-none"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
            >
              <Mic size={48} strokeWidth={2} />
            </motion.button>

            <p
              className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "#5AAF78" }}
            >
              {selectedPatient ? "Tap to start recording" : "Patient selection required"}
            </p>

            <div className="mt-2 flex items-center justify-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: prescriptionContext === "none"
                    ? "rgba(140, 199, 161, 0.25)"
                    : "rgba(140, 199, 161, 0.8)",
                }}
              />
              <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                Rx {prescriptionContext === "none" ? "not attached" : "attached"}
              </p>
            </div>
          </div>
        </motion.section>

        {/* ─── Latest Voice Log ─── */}
        {latestVoiceLog && (
          <motion.section
            className="glass-panel p-5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-soft)" }}>
                  Latest Structured Log
                </p>
                <p className="mt-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {latestVoiceLog.updatedAt}
                </p>
              </div>
              {latestVoiceLog.needsReview && (
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border"
                  style={{
                    background: "rgba(140, 199, 161, 0.08)",
                    color: "var(--text-primary)",
                    borderColor: "rgba(140, 199, 161, 0.15)",
                  }}
                >
                  Needs Review
                </span>
              )}
            </div>
            <p className="line-clamp-3 text-[13px] leading-relaxed font-medium" style={{ color: "var(--text-primary)" }}>
              {latestVoiceLog.transcript}
            </p>
            {entityChips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {entityChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border px-3 py-1 text-[10px] font-bold bg-white/70"
                    style={{ borderColor: "rgba(140, 199, 161, 0.15)", color: "var(--text-primary)" }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* ─── AI Insight ─── */}
        <motion.section
          className="glass-panel overflow-hidden"
          style={{ borderLeft: "3px solid rgba(140, 199, 161, 0.5)" }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
        >
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div
                className="h-11 w-11 rounded-2xl border grid place-items-center shadow-sm shrink-0"
                style={{ borderColor: "rgba(140, 199, 161, 0.12)", background: "rgba(140, 199, 161, 0.08)" }}
              >
                <Brain size={22} style={{ color: "rgba(140, 199, 161, 0.7)" }} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(140, 199, 161, 0.7)" }}>
                  AI Insight
                </p>
                <h2 className="mt-1 text-[15px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  Elevated heart-rate pattern detected
                </h2>
                <p className="mt-1 text-[13px] font-medium leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Immediate check recommended. Linked records are ready for handoff review.
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <motion.button
                type="button"
                onClick={() => navigate("/handoff")}
                className="rounded-full shadow-sm px-5 py-2.5 text-[13px] font-bold text-white transition-colors"
                style={{ background: "rgba(140, 199, 161, 0.85)" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                View Records
              </motion.button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
