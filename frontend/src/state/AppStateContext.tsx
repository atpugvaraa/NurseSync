import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type PatientContext = {
  id: string;
  name: string;
  room: string;
  mrn: string;
  age: number;
};

export type TaskItem = {
  id: string;
  title: string;
  room: string;
  completed: boolean;
  overdueMinutes: number;
};

export type VoiceLogEntry = {
  id: string;
  transcript: string;
  confidence: number;
  updatedAt: string;
};

export type AppState = {
  selectedPatient: PatientContext;
  setSelectedPatient: (patient: PatientContext) => void;
  tasks: TaskItem[];
  toggleTask: (id: string) => void;
  latestVoiceLog: VoiceLogEntry;
  saveVoiceLog: (entry: VoiceLogEntry) => void;
};

const defaultPatient: PatientContext = {
  id: "PX-99201",
  name: "Sarah Jenkins",
  room: "402-B",
  mrn: "12345678",
  age: 65,
};

const initialTasks: TaskItem[] = [
  {
    id: "task-1",
    title: "Medication Administration",
    room: "402-A",
    completed: false,
    overdueMinutes: 15,
  },
  {
    id: "task-2",
    title: "Post-Op Vital Check",
    room: "415",
    completed: false,
    overdueMinutes: 5,
  },
  {
    id: "task-3",
    title: "Respiratory Assessment",
    room: "402-B",
    completed: true,
    overdueMinutes: 0,
  },
];

const initialVoiceLog: VoiceLogEntry = {
  id: "log-1",
  transcript:
    "Patient presents with mild respiratory distress. Administered 2mg Albuterol at 14:15. BP 128/82. SpO2 steady at 96%.",
  confidence: 98.4,
  updatedAt: "14:15",
};

const AppStateContext = createContext<AppState | undefined>(undefined);

type AppStateProviderProps = {
  children: React.ReactNode;
};

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [selectedPatient, setSelectedPatient] =
    useState<PatientContext>(defaultPatient);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [latestVoiceLog, setLatestVoiceLog] =
    useState<VoiceLogEntry>(initialVoiceLog);

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

  const value = useMemo(
    () => ({
      selectedPatient,
      setSelectedPatient,
      tasks,
      toggleTask,
      latestVoiceLog,
      saveVoiceLog,
    }),
    [latestVoiceLog, saveVoiceLog, selectedPatient, tasks, toggleTask],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }

  return context;
}
