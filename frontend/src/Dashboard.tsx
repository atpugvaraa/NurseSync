import { useState } from 'react';
import { useAudioRecorder } from './AudioRecorder';
import {
    Bell,
    Search,
    Brain,
    TrendingUp,
    AlertCircle,
    ArrowRight,
    LayoutDashboard,
    CalendarDays,
    Users,
    User,
    Mic,
    CheckCircle2,
    Clock,
    X
} from 'lucide-react';

interface DashboardProps {
    onNavigateToHandoff?: () => void;
}

export default function Dashboard({ onNavigateToHandoff }: DashboardProps) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [patientFilter, setPatientFilter] = useState('all');
    const [insightDismissed, setInsightDismissed] = useState(false);

    const { isRecording, recordingDuration, toggleRecording } = useAudioRecorder();

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div
            className="min-h-screen pb-28 text-slate-900 relative"
            style={{ background: '#F0F4F8', fontFamily: "'DM Sans', sans-serif" }}
        >
            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
                style={{ background: 'rgba(240,244,248,0.85)', backdropFilter: 'blur(12px)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                        <img
                            src="https://api.dicebear.com/7.x/notionists/svg?seed=Preya&backgroundColor=c0aede"
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold tracking-widest text-teal-600 uppercase"
                            style={{ fontFamily: "'Nunito', sans-serif" }}>
                            Evening Shift • ICU
                        </p>
                        <h1 className="text-xl font-extrabold text-slate-900 leading-tight"
                            style={{ fontFamily: "'Nunito', sans-serif" }}>
                            NurseSync
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-teal-600 transition-colors">
                        <Search size={19} strokeWidth={2.5} />
                    </button>
                    <button className="relative w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-teal-600 transition-colors">
                        <Bell size={19} strokeWidth={2.5} />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </header>

            <main className="px-4 flex flex-col gap-5">

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    {/* Patients */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-white/80 flex flex-col justify-between" style={{ minHeight: 96 }}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                            style={{ fontFamily: "'Nunito', sans-serif" }}>Patients</span>
                        <div>
                            <div className="text-[28px] font-extrabold text-slate-800 leading-none"
                                style={{ fontFamily: "'Nunito', sans-serif" }}>12</div>
                            <div className="text-[11px] font-bold text-teal-600 mt-1.5 flex items-center gap-1">
                                <TrendingUp size={11} strokeWidth={3} />
                                <span>+2 today</span>
                            </div>
                        </div>
                    </div>

                    {/* Active */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-white/80 flex flex-col justify-between" style={{ minHeight: 96 }}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                            style={{ fontFamily: "'Nunito', sans-serif" }}>Active</span>
                        <div>
                            <div className="text-[28px] font-extrabold text-slate-800 leading-none"
                                style={{ fontFamily: "'Nunito', sans-serif" }}>2</div>
                            <div className="text-[11px] font-bold text-orange-500 mt-1.5 flex items-center gap-1">
                                <AlertCircle size={11} strokeWidth={3} />
                                <span>Logs req.</span>
                            </div>
                        </div>
                    </div>

                    {/* Shift */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-white/80 flex flex-col justify-between" style={{ minHeight: 96 }}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                            style={{ fontFamily: "'Nunito', sans-serif" }}>Shift</span>
                        <div>
                            <div className="text-[28px] font-extrabold text-slate-800 leading-none mb-2"
                                style={{ fontFamily: "'Nunito', sans-serif" }}>65%</div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: '65%', background: 'linear-gradient(90deg, #0d9488, #14b8a6)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Insights Card */}
                {!insightDismissed && (
                    <section>
                        <div className="flex items-center gap-2 mb-2.5 px-1">
                            <span className="text-[11px] font-extrabold text-teal-700 uppercase tracking-widest"
                                style={{ fontFamily: "'Nunito', sans-serif" }}>AI Insights</span>
                        </div>

                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-white/80 flex flex-col gap-4 relative overflow-hidden">
                            {/* Left accent bar */}
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-400 rounded-l-3xl"></div>

                            <div className="flex items-start gap-3 pl-2">
                                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                    <Brain size={22} className="text-slate-700" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}>System Notification</span>
                                        <span className="text-[11px] font-semibold text-slate-400">2m ago</span>
                                    </div>
                                    <h3 className="text-[15px] font-bold text-slate-900 mt-1 leading-snug"
                                        style={{ fontFamily: "'Nunito', sans-serif" }}>
                                        Patient in 302: Heart rate trending upward (115 bpm)
                                    </h3>
                                    <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">
                                        AI detected anomaly in vitals. Immediate check recommended for Room 302.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end pl-2">
                                <button
                                    onClick={() => setInsightDismissed(true)}
                                    className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-slate-200 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    <X size={14} strokeWidth={2.5} />
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Patients List */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-[22px] font-extrabold text-slate-900"
                            style={{ fontFamily: "'Nunito', sans-serif" }}>My Patients</h2>
                        <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-slate-100">
                            <button
                                onClick={() => setPatientFilter('all')}
                                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                                style={{
                                    fontFamily: "'Nunito', sans-serif",
                                    background: patientFilter === 'all' ? '#1e293b' : 'transparent',
                                    color: patientFilter === 'all' ? '#fff' : '#94a3b8'
                                }}
                            >All</button>
                            <button
                                onClick={() => setPatientFilter('alerts')}
                                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                                style={{
                                    fontFamily: "'Nunito', sans-serif",
                                    background: patientFilter === 'alerts' ? '#1e293b' : 'transparent',
                                    color: patientFilter === 'alerts' ? '#fff' : '#94a3b8'
                                }}
                            >Alerts</button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">

                        {/* Card 1: Sarah Johnson - High Risk */}
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-white/80 relative overflow-hidden">
                            {/* Subtle red tint corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-[80px]" style={{ background: 'rgba(254,226,226,0.5)' }}></div>

                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-[54px] h-[54px] rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0 shadow-sm">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}>Room</span>
                                        <span className="text-lg font-extrabold text-slate-800 leading-tight"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}>302</span>
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] font-bold text-slate-900"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}>Sarah Johnson</h3>
                                        <p className="text-[12px] text-slate-500 mt-0.5 font-medium">Post-Op Recovery • High Risk</p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-red-100 text-red-600"
                                    style={{ background: 'rgba(254,226,226,0.6)', fontFamily: "'Nunito', sans-serif" }}>
                                    Active Check
                                </span>
                            </div>

                            {/* Vitals */}
                            <div className="grid grid-cols-3 gap-0 mt-5 py-4 border-t border-b border-slate-50">
                                <div className="text-center relative">
                                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1"
                                        style={{ fontFamily: "'Nunito', sans-serif" }}>BPM</span>
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-[20px] font-bold text-slate-900" style={{ fontFamily: 'monospace' }}>115</span>
                                        <TrendingUp size={13} strokeWidth={3} className="text-red-500" style={{ marginBottom: 2 }} />
                                    </div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-100"></div>
                                </div>
                                <div className="text-center relative">
                                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1"
                                        style={{ fontFamily: "'Nunito', sans-serif" }}>BP</span>
                                    <span className="text-[20px] font-bold text-slate-900" style={{ fontFamily: 'monospace' }}>142/90</span>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-100"></div>
                                </div>
                                <div className="text-center">
                                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1"
                                        style={{ fontFamily: "'Nunito', sans-serif" }}>SPO2</span>
                                    <span className="text-[20px] font-bold text-slate-900" style={{ fontFamily: 'monospace' }}>96%</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                    </div>
                                    {/* Waveform icon */}
                                    <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
                                        <polyline points="0,8 4,8 6,2 8,14 10,8 12,8 14,4 16,12 18,8 20,8 22,3 24,13 26,8 32,8"
                                            stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                </div>
                                <button
                                    onClick={onNavigateToHandoff}
                                    className="flex items-center gap-1.5 text-[13px] font-bold text-teal-700 hover:text-teal-800 transition-colors"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    View Records <ArrowRight size={15} strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        {/* Card 2: Marcus Chen - Stable */}
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-white/80">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-[54px] h-[54px] rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0 shadow-sm">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}>Room</span>
                                        <span className="text-lg font-extrabold text-slate-800 leading-tight"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}>405</span>
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] font-bold text-slate-900"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}>Marcus Chen</h3>
                                        <p className="text-[12px] text-slate-500 mt-0.5 font-medium">Pneumonia • Stable</p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400"
                                    style={{ fontFamily: "'Nunito', sans-serif", paddingTop: 4 }}>
                                    Last checked 45m
                                </span>
                            </div>

                            {/* Meds pill */}
                            <div className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <CheckCircle2 size={18} className="text-slate-700 shrink-0" strokeWidth={2.5} />
                                <span className="text-[13px] font-semibold text-slate-700">Morning Meds Administered</span>
                            </div>
                        </div>

                        {/* Card 3: Elena Rodriguez - Routine */}
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-white/80">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-[54px] h-[54px] rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0 shadow-sm">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}>Room</span>
                                        <span className="text-lg font-extrabold text-slate-800 leading-tight"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}>211</span>
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] font-bold text-slate-900"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}>Elena Rodriguez</h3>
                                        <p className="text-[12px] text-slate-500 mt-0.5 font-medium">Post-Op Recovery • Routine</p>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming task */}
                            <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-100" style={{ background: '#f8fafc' }}>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                                        <Clock size={15} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider"
                                            style={{ fontFamily: "'Nunito', sans-serif" }}>Upcoming Task</p>
                                        <p className="text-[13px] font-semibold text-slate-800">Wound Care Dressing Change</p>
                                    </div>
                                </div>
                                <span className="text-[13px] font-bold text-slate-700"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}>09:30 AM</span>
                            </div>
                        </div>

                    </div>
                </section>

            </main>

            {/* FAB - Voice Recorder */}
            <div className="fixed bottom-[88px] right-5 z-50 flex flex-col items-center gap-2">
                {/* Recording label */}
                {isRecording && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-bold"
                        style={{ background: '#ef4444', fontFamily: "'Nunito', sans-serif", boxShadow: '0 4px 12px rgba(239,68,68,0.4)' }}>
                        <span className="w-2 h-2 rounded-full bg-white inline-block" style={{ animation: 'pulse 1s infinite' }}></span>
                        Recording {formatDuration(recordingDuration)}
                    </div>
                )}
                {/* Outer pulse ring when recording */}
                <div className="relative flex items-center justify-center">
                    {isRecording && (
                        <span className="absolute rounded-full"
                            style={{
                                width: 76, height: 76,
                                background: 'rgba(239,68,68,0.2)',
                                animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite'
                            }}
                        />
                    )}
                    <button
                        onClick={toggleRecording}
                        className="w-[60px] h-[60px] rounded-full flex items-center justify-center focus:outline-none transition-all duration-300"
                        style={{
                            background: isRecording ? '#ef4444' : '#0d9488',
                            boxShadow: isRecording
                                ? '0 0 0 4px rgba(239,68,68,0.2), 0 8px 24px rgba(239,68,68,0.4)'
                                : '0 8px 24px rgba(13,148,136,0.35)',
                            transform: isRecording ? 'scale(1.08)' : 'scale(1)',
                            position: 'relative', zIndex: 1
                        }}
                    >
                        <Mic size={26} strokeWidth={2.5} className="text-white" />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes ping {
                    75%, 100% { transform: scale(1.6); opacity: 0; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 z-40"
                style={{ height: 76, paddingBottom: 12 }}>
                <div className="max-w-md mx-auto grid grid-cols-4 h-full px-2">
                    {[
                        { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
                        { id: 'schedule', label: 'Schedule', Icon: CalendarDays },
                        { id: 'patients', label: 'Patients', Icon: Users },
                        { id: 'profile', label: 'Profile', Icon: User },
                    ].map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className="flex flex-col items-center justify-center gap-1 relative"
                        >
                            {activeTab === id && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-teal-500 rounded-b-full"></div>
                            )}
                            <Icon
                                size={22}
                                strokeWidth={activeTab === id ? 2.5 : 2}
                                className={activeTab === id ? 'text-teal-600' : 'text-slate-400'}
                            />
                            <span
                                className="text-[10px] font-bold capitalize"
                                style={{
                                    fontFamily: "'Nunito', sans-serif",
                                    color: activeTab === id ? '#0d9488' : '#94a3b8'
                                }}
                            >{label}</span>
                        </button>
                    ))}
                </div>
            </nav>

        </div>
    );
}