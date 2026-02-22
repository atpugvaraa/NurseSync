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
    style?: React.CSSProperties;
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
        className="route-switcher-fab shadow-md transition-transform hover:scale-[1.05]"
        aria-label="Open route switcher"
        style={{ backgroundColor: "var(--primary-contrast)" }}
      >
        <Plus size={28} strokeWidth={2.5} className="text-white" />
      </button>

      <nav className="universal-nav border-t shadow-[0_-8px_30px_rgba(67,56,202,0.06)] backdrop-blur-xl transition-all" aria-label="Primary" style={{ backgroundColor: "var(--bg-glass)", borderColor: "var(--border-glass)" }}>
        {tabs.map(({ route, label, icon: Icon }) => {
          const active = location.pathname === route;

          return (
            <button
              key={route}
              type="button"
              onClick={() => navigate(route)}
              className="universal-nav-item transition-colors"
              aria-current={active ? "page" : undefined}
            >
              {active && <span className="universal-nav-indicator" style={{ backgroundColor: "var(--primary)" }} />}
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 2}
                style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}
                className="transition-colors"
              />
              <span
                className={
                  active ? "universal-nav-label active font-bold" : "universal-nav-label font-medium"
                }
                style={{ color: active ? "var(--text-primary)" : "var(--text-muted)" }}
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
