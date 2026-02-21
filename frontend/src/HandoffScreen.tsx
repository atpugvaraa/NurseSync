import { useState, useRef, useEffect } from 'react';
import {
    ChevronLeft,
    MoreHorizontal,
    Sparkles,
    Play,
    Pause,
    Heart,
    ClipboardList,
    ChevronRight,
    Check,
    Pencil,
    Send,
    Users,
    Bell,
    User,
    Snowflake,
} from 'lucide-react';

interface HandoffScreenProps {
    onBack: () => void;
}

export default function HandoffScreen({ onBack }: HandoffScreenProps) {
    const [activeBottomTab, setActiveBottomTab] = useState('handoffs');
    const [isPlaying, setIsPlaying] = useState(false);
    const [playProgress, setPlayProgress] = useState(0);
    const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const [taskStates, setTaskStates] = useState<Record<string, boolean>>({
        task1: false,
        task2: false,
        task3: true, // Administered PRN Pain Meds — already completed
    });

    // Animated waveform bars
    const [waveHeights, setWaveHeights] = useState<number[]>([]);

    useEffect(() => {
        const generateWave = () => {
            const bars: number[] = [];
            for (let i = 0; i < 28; i++) {
                bars.push(isPlaying ? 8 + Math.random() * 22 : 4 + Math.sin(i * 0.5) * 3);
            }
            setWaveHeights(bars);
        };
        generateWave();
        if (isPlaying) {
            const interval = setInterval(generateWave, 180);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false);
            if (progressInterval.current) clearInterval(progressInterval.current);
        } else {
            setIsPlaying(true);
            progressInterval.current = setInterval(() => {
                setPlayProgress((prev) => {
                    if (prev >= 100) {
                        if (progressInterval.current) clearInterval(progressInterval.current);
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 0.5;
                });
            }, 100);
        }
    };

    const toggleTask = (id: string) => {
        setTaskStates((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div
            className="min-h-screen pb-28 text-slate-900 relative"
            style={{ background: '#F0F4F8', fontFamily: "'DM Sans', sans-serif" }}
        >
            {/* ─── Header ─── */}
            <header
                className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
                style={{ background: 'rgba(240,244,248,0.85)', backdropFilter: 'blur(14px)' }}
            >
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-teal-600 transition-colors active:scale-95"
                >
                    <ChevronLeft size={22} strokeWidth={2.5} />
                </button>
                <h1
                    className="text-[17px] font-extrabold text-slate-900 tracking-tight"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                    Shift Handoff Summary
                </h1>
                <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-teal-600 transition-colors">
                    <MoreHorizontal size={20} strokeWidth={2.5} />
                </button>
            </header>

            <main className="px-4 flex flex-col gap-5 mt-1">
                {/* ─── Patient Profile Card ─── */}
                <section className="bg-white rounded-3xl p-5 shadow-sm border border-white/80 relative overflow-hidden">
                    {/* Decorative corner */}
                    <div
                        className="absolute -top-4 -right-4 w-28 h-28 rounded-full"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)',
                        }}
                    />

                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div
                                className="w-[68px] h-[68px] rounded-full overflow-hidden border-[3px] border-white shadow-lg"
                                style={{
                                    boxShadow:
                                        '0 4px 16px rgba(0,0,0,0.08), 0 0 0 3px rgba(20,184,166,0.1)',
                                }}
                            >
                                <img
                                    src="https://api.dicebear.com/7.x/notionists/svg?seed=JohnDoe&backgroundColor=b6e3f4"
                                    alt="John Doe"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Verified badge */}
                            <div
                                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                                    boxShadow: '0 2px 6px rgba(13,148,136,0.4)',
                                }}
                            >
                                <Check size={13} strokeWidth={3} className="text-white" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h2
                                className="text-[22px] font-extrabold text-slate-900 leading-tight"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                John Doe
                            </h2>
                            <p className="text-[13px] text-slate-500 font-medium mt-0.5">
                                Room 402 · 72 y/o Male
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(20,184,166,0.06))',
                                        color: '#0d9488',
                                        border: '1px solid rgba(20,184,166,0.15)',
                                        fontFamily: "'Nunito', sans-serif",
                                    }}
                                >
                                    <span
                                        className="w-[6px] h-[6px] rounded-full"
                                        style={{ background: '#14b8a6' }}
                                    />
                                    Stable | Guarded
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── AI Clinical Overview ─── */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2">
                            <Sparkles
                                size={14}
                                strokeWidth={2.5}
                                className="text-teal-600"
                            />
                            <span
                                className="text-[11px] font-extrabold text-teal-700 uppercase tracking-[0.12em]"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                AI Clinical Overview
                            </span>
                        </div>
                        <span
                            className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
                            style={{ fontFamily: "'Nunito', sans-serif" }}
                        >
                            Updated 2m ago
                        </span>
                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-white/80">
                        <p
                            className="text-[14px] text-slate-600 leading-[1.75]"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Patient responded well to nebulizer treatment at{' '}
                            <span className="font-bold text-slate-800 underline decoration-teal-400 decoration-2 underline-offset-2">
                                14:00
                            </span>
                            . Reported reduced pain levels (
                            <span className="font-bold text-slate-800">3/10</span>) post-medication.
                            Mobility remains stable but limited to bedside assistance. Respiratory
                            rate currently within normal limits.
                        </p>

                        {/* Voice Log Card */}
                        <div
                            className="mt-4 rounded-2xl p-4 flex items-center gap-3.5"
                            style={{
                                background:
                                    'linear-gradient(135deg, rgba(240,253,250,1), rgba(204,251,241,0.4))',
                                border: '1px solid rgba(20,184,166,0.12)',
                            }}
                        >
                            <button
                                onClick={togglePlay}
                                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-95"
                                style={{
                                    background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                                    boxShadow: '0 4px 14px rgba(13,148,136,0.35)',
                                }}
                            >
                                {isPlaying ? (
                                    <Pause
                                        size={18}
                                        strokeWidth={2.5}
                                        className="text-white"
                                    />
                                ) : (
                                    <Play
                                        size={18}
                                        strokeWidth={2.5}
                                        className="text-white"
                                        style={{ marginLeft: 2 }}
                                    />
                                )}
                            </button>

                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-[13px] font-bold text-slate-800"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    Voice Log: 12:45 PM
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                    0:42 · Nurse Sarah K.
                                </p>
                                {/* Progress bar */}
                                <div className="h-1 w-full bg-teal-100 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${playProgress}%`,
                                            background:
                                                'linear-gradient(90deg, #0d9488, #14b8a6)',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Animated Waveform */}
                            <div className="flex items-end gap-[2px] h-[30px] shrink-0">
                                {waveHeights.map((h, i) => (
                                    <div
                                        key={i}
                                        className="rounded-full"
                                        style={{
                                            width: 2.5,
                                            height: h,
                                            background: isPlaying
                                                ? `hsl(${168 + i * 2}, 76%, ${40 + (i % 3) * 8}%)`
                                                : '#94a3b8',
                                            transition: 'height 0.15s ease-out',
                                            opacity: isPlaying ? 1 : 0.4,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Critical Alerts (Shift) ─── */}
                <section>
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <Snowflake size={14} strokeWidth={2.5} className="text-teal-600" />
                        <span
                            className="text-[11px] font-extrabold text-slate-500 uppercase tracking-[0.12em]"
                            style={{ fontFamily: "'Nunito', sans-serif" }}
                        >
                            Critical Alerts (Shift)
                        </span>
                    </div>

                    <div
                        className="rounded-3xl p-5 shadow-sm relative overflow-hidden"
                        style={{
                            background:
                                'linear-gradient(135deg, rgba(254,242,242,0.8), rgba(255,255,255,0.95))',
                            border: '1px solid rgba(239,68,68,0.1)',
                        }}
                    >
                        {/* Left accent bar */}
                        <div
                            className="absolute top-0 left-0 w-1 h-full rounded-l-3xl"
                            style={{
                                background: 'linear-gradient(180deg, #ef4444, #f87171)',
                            }}
                        />

                        <div className="flex items-start gap-3.5 pl-2">
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                style={{
                                    background: 'linear-gradient(135deg, #fecaca, #fef2f2)',
                                    border: '1px solid rgba(239,68,68,0.15)',
                                }}
                            >
                                <Heart
                                    size={20}
                                    strokeWidth={2.5}
                                    className="text-red-500"
                                    fill="#ef4444"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <h3
                                        className="text-[15px] font-bold text-slate-900"
                                        style={{ fontFamily: "'Nunito', sans-serif" }}
                                    >
                                        Heart Rate Peak
                                    </h3>
                                    <span
                                        className="text-[11px] font-bold text-red-400 mt-0.5"
                                        style={{ fontFamily: "'Nunito', sans-serif" }}
                                    >
                                        16:45
                                    </span>
                                </div>
                                <p className="text-[13px] text-slate-500 leading-relaxed mt-1">
                                    Tachycardia episode detected. HR peaked at{' '}
                                    <span className="font-bold text-slate-800">115 BPM</span>.
                                    Resolved after rest and IV fluids.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Handoff Tasks ─── */}
                <section>
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <ClipboardList size={14} strokeWidth={2.5} className="text-teal-600" />
                        <span
                            className="text-[11px] font-extrabold text-slate-500 uppercase tracking-[0.12em]"
                            style={{ fontFamily: "'Nunito', sans-serif" }}
                        >
                            Handoff Tasks
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Task 1: Review evening lab results */}
                        <div
                            className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-white/80 flex items-center gap-3 active:scale-[0.99] transition-transform cursor-pointer"
                            onClick={() => toggleTask('task1')}
                        >
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
                                style={{
                                    background: taskStates.task1
                                        ? 'linear-gradient(135deg, #0d9488, #14b8a6)'
                                        : '#f8fafc',
                                    border: taskStates.task1
                                        ? '1px solid #0d9488'
                                        : '2px solid #cbd5e1',
                                }}
                            >
                                {taskStates.task1 && (
                                    <Check size={15} strokeWidth={3} className="text-white" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-[14px] font-semibold text-slate-800"
                                    style={{
                                        textDecoration: taskStates.task1
                                            ? 'line-through'
                                            : 'none',
                                        opacity: taskStates.task1 ? 0.5 : 1,
                                    }}
                                >
                                    Review evening lab results
                                </p>
                                {!taskStates.task1 && (
                                    <p
                                        className="text-[11px] font-bold mt-0.5 uppercase tracking-wider"
                                        style={{
                                            color: '#f59e0b',
                                            fontFamily: "'Nunito', sans-serif",
                                        }}
                                    >
                                        STAT ORDER PENDING
                                    </p>
                                )}
                            </div>
                            <ChevronRight size={18} className="text-slate-300 shrink-0" />
                        </div>

                        {/* Task 2: Change IV dressing */}
                        <div
                            className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-white/80 flex items-center gap-3 active:scale-[0.99] transition-transform cursor-pointer"
                            onClick={() => toggleTask('task2')}
                        >
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
                                style={{
                                    background: taskStates.task2
                                        ? 'linear-gradient(135deg, #0d9488, #14b8a6)'
                                        : '#f8fafc',
                                    border: taskStates.task2
                                        ? '1px solid #0d9488'
                                        : '2px solid #cbd5e1',
                                }}
                            >
                                {taskStates.task2 && (
                                    <Check size={15} strokeWidth={3} className="text-white" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-[14px] font-semibold text-slate-800"
                                    style={{
                                        textDecoration: taskStates.task2
                                            ? 'line-through'
                                            : 'none',
                                        opacity: taskStates.task2 ? 0.5 : 1,
                                    }}
                                >
                                    Change IV dressing
                                </p>
                                {!taskStates.task2 && (
                                    <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                                        Due at 20:00
                                    </p>
                                )}
                            </div>
                            <ChevronRight size={18} className="text-slate-300 shrink-0" />
                        </div>

                        {/* Task 3: Administered PRN Pain Meds - COMPLETED */}
                        <div
                            className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-white/80 flex items-center gap-3 active:scale-[0.99] transition-transform cursor-pointer"
                            onClick={() => toggleTask('task3')}
                        >
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
                                style={{
                                    background: taskStates.task3
                                        ? 'linear-gradient(135deg, #0d9488, #14b8a6)'
                                        : '#f8fafc',
                                    border: taskStates.task3
                                        ? '1px solid #0d9488'
                                        : '2px solid #cbd5e1',
                                }}
                            >
                                {taskStates.task3 && (
                                    <Check size={15} strokeWidth={3} className="text-white" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-[14px] font-semibold text-slate-800"
                                    style={{
                                        textDecoration: taskStates.task3
                                            ? 'line-through'
                                            : 'none',
                                        opacity: taskStates.task3 ? 0.5 : 1,
                                    }}
                                >
                                    Administered PRN Pain Meds
                                </p>
                                <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                                    Completed at 14:15
                                </p>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 shrink-0" />
                        </div>
                    </div>
                </section>

                {/* ─── Action Buttons ─── */}
                <section className="flex items-center gap-3 mt-1">
                    <button
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-[14px] font-bold transition-all active:scale-[0.97]"
                        style={{
                            background: '#ffffff',
                            color: '#334155',
                            border: '1.5px solid #e2e8f0',
                            fontFamily: "'Nunito', sans-serif",
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                    >
                        <Pencil size={16} strokeWidth={2.5} />
                        Edit Summary
                    </button>
                    <button
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-[14px] font-bold text-white transition-all active:scale-[0.97]"
                        style={{
                            background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                            fontFamily: "'Nunito', sans-serif",
                            boxShadow: '0 4px 16px rgba(13,148,136,0.35)',
                        }}
                    >
                        <Send size={16} strokeWidth={2.5} />
                        Send Handoff
                    </button>
                </section>
            </main>

            {/* ─── Bottom Navigation ─── */}
            <nav
                className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 z-40"
                style={{ height: 76, paddingBottom: 12 }}
            >
                <div className="max-w-md mx-auto grid grid-cols-4 h-full px-2">
                    {[
                        { id: 'patients', label: 'Patients', Icon: Users },
                        { id: 'handoffs', label: 'Handoffs', Icon: ClipboardList },
                        { id: 'alerts', label: 'Alerts', Icon: Bell },
                        { id: 'profile', label: 'Profile', Icon: User },
                    ].map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveBottomTab(id)}
                            className="flex flex-col items-center justify-center gap-1 relative"
                        >
                            {activeBottomTab === id && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-teal-500 rounded-b-full" />
                            )}
                            <Icon
                                size={22}
                                strokeWidth={activeBottomTab === id ? 2.5 : 2}
                                className={
                                    activeBottomTab === id
                                        ? 'text-teal-600'
                                        : 'text-slate-400'
                                }
                            />
                            <span
                                className="text-[10px] font-bold capitalize"
                                style={{
                                    fontFamily: "'Nunito', sans-serif",
                                    color:
                                        activeBottomTab === id ? '#0d9488' : '#94a3b8',
                                }}
                            >
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}
