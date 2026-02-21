import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import RouteSwitcherSheet from "./components/RouterSwitcherSheet.tsx";
import UniversalBottomNav from "./components/UniversalBottomNav.tsx";
import "./App.css";

const BASE_URL = "http://localhost:8000";

// hardcoded for now, replace with auth later
const NURSE_ID = "b0000000-0000-0000-0000-000000000001";

function AppShell() {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [shiftId, setShiftId] = useState<string>("");

  useEffect(() => {
    // auto start shift when app loads
    axios.post(`${BASE_URL}/api/handoff/shift/start`, { nurse_id: NURSE_ID })
      .then(({ data }) => {
        setShiftId(data.shift.id);
        console.log("✅ Shift started:", data.shift.id);
      })
      .catch((err) => console.error("Failed to start shift:", err));
  }, []);

  return (
    <div className="app-shell">
      <div className="app-content">
        <Outlet context={{ shiftId, nurseId: NURSE_ID }} />  {/* ← pass down via context */}
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