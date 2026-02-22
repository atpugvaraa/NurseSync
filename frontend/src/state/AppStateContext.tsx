import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Patient, StructuredLog } from "../api/types";

export type TaskItem = {
  id: string;
  title: string;
  ward: string;
  completed: boolean;
  overdueMinutes: number;
};

export type VoiceLogEntry = {
  id: string;
  patientId: string;
  rawTranscript: string;
  cleanTranscript: string;
  transcript: string;
  confidence: number;
  needsReview: boolean;
  structuredLog: StructuredLog | null;
  updatedAt: string;
};

export type AppState = {
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  tasks: TaskItem[];
  toggleTask: (id: string) => void;
  latestVoiceLog: VoiceLogEntry | null;
  saveVoiceLog: (entry: VoiceLogEntry) => void;
  prescriptionContext: string;
  setPrescriptionContext: (context: string) => void;
  clearPrescriptionContext: () => void;
};

const initialTasks: TaskItem[] = [
  {
    id: "task-1",
    title: "Medication Administration",
    ward: "Ward 3",
    completed: false,
    overdueMinutes: 15,
  },
  {
    id: "task-2",
    title: "Post-Op Vital Check",
    ward: "Ward 3",
    completed: false,
    overdueMinutes: 5,
  },
  {
    id: "task-3",
    title: "Respiratory Assessment",
    ward: "Ward 2",
    completed: true,
    overdueMinutes: 0,
  },
];

const AppStateContext = createContext<AppState | undefined>(undefined);

type AppStateProviderProps = {
  children: React.ReactNode;
};

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [latestVoiceLog, setLatestVoiceLog] = useState<VoiceLogEntry | null>(null);
  const [prescriptionContext, setPrescriptionContext] = useState<string>("none");

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) {
          return task;
        }

        return {
          ...task,
          completed: !task.completed,
          overdueMinutes: task.completed ? 5 : 0,
        };
      }),
    );
  }, []);

  const saveVoiceLog = useCallback((entry: VoiceLogEntry) => {
    setLatestVoiceLog(entry);
  }, []);

  const clearPrescriptionContext = useCallback(() => {
    setPrescriptionContext("none");
  }, []);

  const value = useMemo(
    () => ({
      selectedPatient,
      setSelectedPatient,
      tasks,
      toggleTask,
      latestVoiceLog,
      saveVoiceLog,
      prescriptionContext,
      setPrescriptionContext,
      clearPrescriptionContext,
    }),
    [
      clearPrescriptionContext,
      latestVoiceLog,
      prescriptionContext,
      saveVoiceLog,
      selectedPatient,
      tasks,
      toggleTask,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }

  return context;
}
