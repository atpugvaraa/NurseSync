import { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import RouteSwitcherSheet from "./components/RouterSwitcherSheet.tsx";
import UniversalBottomNav from "./components/UniversalBottomNav.tsx";
import { startShift } from "./api/client";
import "./App.css";

const NURSES = {
  priya:  { id: "b0000000-0000-0000-0000-000000000001", name: "Nurse Priya" },
  ananya: { id: "c0000000-0000-0000-0000-000000000001", name: "Nurse Ananya" },
};

export type AppOutletContext = {
  shiftId: string;
  nurseId: string;
  nurseName: string;
  setShiftId: (nextShiftId: string) => void;
};

function AppShell() {
  const [searchParams] = useSearchParams();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [shiftId, setShiftId] = useState<string>("");

  // ?nurse=priya or ?nurse=ananya — defaults to priya
  const nurseKey = (searchParams.get("nurse") as keyof typeof NURSES) ?? "priya";
  const nurse = NURSES[nurseKey] ?? NURSES.priya;

  useEffect(() => {
    let cancelled = false;

    startShift({ nurse_id: nurse.id })
      .then((data) => {
        if (cancelled) return;
        setShiftId(data.shift.id);
        console.log(`✅ Shift started for ${nurse.name}:`, data.shift.id);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to start shift:", err);
      });

    return () => { cancelled = true; };
  }, [nurse.id]);

  return (
    <div className="app-shell">
      {/* nurse indicator banner */}
      <div
        className="w-full py-1.5 text-center text-xs font-bold text-white"
        style={{ background: nurseKey === "priya" ? "#0d9488" : "#8b5cf6" }}
      >
        {nurse.name}
      </div>

      <div className="app-content">
        <Outlet context={{ shiftId, nurseId: nurse.id, nurseName: nurse.name, setShiftId }} />
      </div>
      <UniversalBottomNav onOpenRouteSwitcher={() => setSwitcherOpen(true)} />
      <RouteSwitcherSheet
        open={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
      />
    </div>
  );
}

export default AppShell;