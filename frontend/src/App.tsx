import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import RouteSwitcherSheet from "./components/RouterSwitcherSheet.tsx";
import UniversalBottomNav from "./components/UniversalBottomNav.tsx";
import { startShift } from "./api/client";
import "./App.css";

const NURSE_ID = "b0000000-0000-0000-0000-000000000001";

export type AppOutletContext = {
  shiftId: string;
  nurseId: string;
  setShiftId: (nextShiftId: string) => void;
};

function AppShell() {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [shiftId, setShiftId] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    startShift({ nurse_id: NURSE_ID })
      .then((data) => {
        if (cancelled) return;
        setShiftId(data.shift.id);
        console.log("Shift started:", data.shift.id);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to start shift:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app-shell">
      <div className="app-content">
        <Outlet context={{ shiftId, nurseId: NURSE_ID, setShiftId }} />
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
