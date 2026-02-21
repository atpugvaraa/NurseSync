export type AppRoute =
  | "/dashboard"
  | "/handoff"
  | "/tasks"
  | "/patients"
  | "/assistant"
  | "/voice-log"
  | "/scanner"
  | "/discharge-summary";

export type PrimaryRoute = "/dashboard" | "/handoff" | "/tasks" | "/patients";
export type SecondaryRoute =
  | "/assistant"
  | "/voice-log"
  | "/scanner"
  | "/discharge-summary";

export interface RouteItem {
  path: AppRoute;
  label: string;
  description: string;
}

export const DEFAULT_ROUTE: AppRoute = "/dashboard";

export const PRIMARY_ROUTES: RouteItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    description: "Shift overview and AI alerts",
  },
  {
    path: "/handoff",
    label: "Handoff",
    description: "Shift handoff summary and tasks",
  },
  {
    path: "/tasks",
    label: "Tasks",
    description: "Prioritized task queue",
  },
  {
    path: "/patients",
    label: "Patients",
    description: "Patient care timeline",
  },
];

export const SECONDARY_ROUTES: RouteItem[] = [
  {
    path: "/assistant",
    label: "Assistant",
    description: "NurseSync AI assistant",
  },
  {
    path: "/voice-log",
    label: "Voice Log",
    description: "Live voice transcription",
  },
  {
    path: "/scanner",
    label: "Scanner",
    description: "Prescription/report extraction",
  },
  {
    path: "/discharge-summary",
    label: "Discharge",
    description: "Discharge summary draft",
  },
];
