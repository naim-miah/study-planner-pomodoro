import type { CSSProperties } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { TimerPage } from "./pages/TimerPage";
import { HistoryPage } from "./pages/HistoryPage";
import { GoalsPage } from "./pages/GoalsPage";
import { StatsPage } from "./pages/StatsPage";

const linkStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 10,
  textDecoration: "none",
  border: "1px solid #ddd",
};

export default function App() {
  return (
    <div>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Study Planner • Pomodoro</h1>

          <nav style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                ...linkStyle,
                background: isActive ? "#222" : "transparent",
                color: isActive ? "white" : "inherit",
              })}
            >
              Timer
            </NavLink>

            <NavLink
              to="/history"
              style={({ isActive }) => ({
                ...linkStyle,
                background: isActive ? "#222" : "transparent",
                color: isActive ? "white" : "inherit",
              })}
            >
              History
            </NavLink>

            <NavLink
              to="/goals"
              style={({ isActive }) => ({
                ...linkStyle,
                background: isActive ? "#222" : "transparent",
                color: isActive ? "white" : "inherit",
              })}
            >
              Goals
            </NavLink>

            <NavLink
              to="/stats"
              style={({ isActive }) => ({
                ...linkStyle,
                background: isActive ? "#222" : "transparent",
                color: isActive ? "white" : "inherit",
              })}
            >
              Stats
            </NavLink>
          </nav>
        </div>
      </header>

      <main style={{ padding: 16, display: "flex", justifyContent: "center" }}>
       <div style={{ width: "100%", maxWidth: 900 }}>
        <Routes>
         <Route path="/" element={<TimerPage />} />
         <Route path="/history" element={<HistoryPage />} />
         <Route path="/goals" element={<GoalsPage />} />
         <Route path="/stats" element={<StatsPage />} />
        </Routes>
       </div>
       </main>

    </div>
  );
}
