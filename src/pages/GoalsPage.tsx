import { useEffect, useMemo, useState } from "react";
import { useSettings } from "../hooks/useSettings";
import { useSessions } from "../hooks/useSessions";
import { toLocalDateKey, minutesFromSeconds } from "../utils/time";

export function GoalsPage() {
  const { settings, loading, updateSettings } = useSettings();
  const { sessions, refresh } = useSessions();

  const [pomodoro, setPomodoro] = useState(25);
  const [brk, setBrk] = useState(5);
  const [goal, setGoal] = useState(120);

  useEffect(() => {
    if (!settings) return;
    setPomodoro(settings.pomodoro_length);
    setBrk(settings.break_length);
    setGoal(settings.daily_goal);
  }, [settings]);

  const todayKey = toLocalDateKey(new Date().toISOString());

  const todayFocusedMin = useMemo(() => {
    return sessions
      .filter((s) => toLocalDateKey(s.start_time) === todayKey)
      .reduce((sum, s) => sum + minutesFromSeconds(s.duration), 0);
  }, [sessions, todayKey]);

  const progress = useMemo(() => {
    const g = goal || 1;
    return Math.min(1, todayFocusedMin / g);
  }, [todayFocusedMin, goal]);

  if (loading || !settings) return <div style={{ padding: 16 }}>Loading…</div>;

  async function onSave() {
    await updateSettings({
      pomodoro_length: Math.max(1, Math.floor(pomodoro)),
      break_length: Math.max(1, Math.floor(brk)),
      daily_goal: Math.max(1, Math.floor(goal)),
    });
    await refresh();
    alert("Saved!");
  }

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <h2>Goals & Settings</h2>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>Daily goal</h3>
        <div style={{ marginBottom: 8 }}>
          Today: <b>{todayFocusedMin}</b> min / Goal: <b>{goal}</b> min
        </div>
        <div style={{ height: 12, background: "#eee", borderRadius: 999 }}>
          <div
            style={{
              height: 12,
              width: `${progress * 100}%`,
              background: "#222",
              borderRadius: 999,
              transition: "width 200ms",
            }}
          />
        </div>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Settings</h3>

        <label style={{ display: "block", marginBottom: 8 }}>
          Pomodoro length (minutes)
          <input
            type="number"
            value={pomodoro}
            onChange={(e) => setPomodoro(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            min={1}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Break length (minutes)
          <input
            type="number"
            value={brk}
            onChange={(e) => setBrk(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            min={1}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Daily goal (minutes)
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            min={1}
          />
        </label>

        <button onClick={onSave}>Save</button>
      </div>
    </div>
  );
}
