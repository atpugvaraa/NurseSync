import { useState } from "react";
import { Outlet } from "react-router-dom";
import RouteSwitcherSheet from "./components/RouterSwitcherSheet.tsx";
import UniversalBottomNav from "./components/UniversalBottomNav.tsx";
import "./App.css";

function AppShell() {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="app-content">
        <Outlet />
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
