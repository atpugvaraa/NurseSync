import { useState } from "react";
import Dashboard from "./Dashboard";
import HandoffScreen from "./HandoffScreen";
import "./App.css";

type Screen = "dashboard" | "handoff";

function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");

  if (screen === "handoff") {
    return <HandoffScreen onBack={() => setScreen("dashboard")} />;
  }

  return (
    <Dashboard onNavigateToHandoff={() => setScreen("handoff")} />
  );
}

export default App;
