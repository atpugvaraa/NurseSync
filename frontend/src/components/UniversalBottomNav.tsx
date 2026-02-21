import {
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  Plus,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { PrimaryRoute } from "../routes";

type UniversalBottomNavProps = {
  onOpenRouteSwitcher: () => void;
};

type TabDef = {
  route: PrimaryRoute;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
};

const tabs: TabDef[] = [
  { route: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { route: "/handoff", label: "Handoff", icon: ClipboardList },
  { route: "/tasks", label: "Tasks", icon: ListChecks },
  { route: "/patients", label: "Patients", icon: Users },
];

export default function UniversalBottomNav({
  onOpenRouteSwitcher,
}: UniversalBottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <button
        type="button"
        onClick={onOpenRouteSwitcher}
        className="route-switcher-fab"
        aria-label="Open route switcher"
      >
        <Plus size={28} strokeWidth={2.5} className="text-white" />
      </button>

      <nav className="universal-nav" aria-label="Primary">
        {tabs.map(({ route, label, icon: Icon }) => {
          const active = location.pathname === route;

          return (
            <button
              key={route}
              type="button"
              onClick={() => navigate(route)}
              className="universal-nav-item"
              aria-current={active ? "page" : undefined}
            >
              {active && <span className="universal-nav-indicator" />}
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 2}
                className={active ? "text-teal-600" : "text-slate-400"}
              />
              <span
                className={
                  active ? "universal-nav-label active" : "universal-nav-label"
                }
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
