import { createHashRouter, Navigate } from "react-router-dom";
import AppShell from "./App";
import Dashboard from "./Dashboard";
import HandoffScreen from "./HandoffScreen";
import { DEFAULT_ROUTE } from "./routes";
import AIAssistantView from "./views/AiAssistantView";
import DischargeSummaryView from "./views/DischargeSummaryView";
import PatientTimelineView from "./views/PatientTimelineView";
import ScannerView from "./views/ScannerView";
import TaskManagerView from "./views/TaskManagerView";
import VoiceLogView from "./views/VoiceLogView";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to={DEFAULT_ROUTE} replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "handoff",
        element: <HandoffScreen />,
      },
      {
        path: "tasks",
        element: <TaskManagerView />,
      },
      {
        path: "patients",
        element: <PatientTimelineView />,
      },
      {
        path: "assistant",
        element: <AIAssistantView />,
      },
      {
        path: "voice-log",
        element: <VoiceLogView />,
      },
      {
        path: "scanner",
        element: <ScannerView />,
      },
      {
        path: "discharge-summary",
        element: <DischargeSummaryView />,
      },
      {
        path: "*",
        element: <Navigate to={DEFAULT_ROUTE} replace />,
      },
    ],
  },
]);
