import { useSettings } from "../hooks/useSettings";
import { useTimer } from "../hooks/useTimer";
import { formatMMSS } from "../utils/time";

export function TimerPage() {
  const { settings, loading } = useSettings();
  const timer = useTimer(settings);

  if (loading || !settings) return <div>Loading…</div>;

  const modeLabel = timer.mode === "focus" ? "Focus" : "Break";

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Timer</h2>
      <p style={{ opacity: 0.85, marginTop: 6 }}>
        Tip: Complete a <b>Focus</b> round to automatically save it to <b>History</b>.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          justifyContent: "center",
          gap: 14,
          marginTop: 14,
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 16,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Current mode</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{modeLabel}</div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => timer.switchMode("focus")} disabled={timer.isRunning}>
                Focus
              </button>
              <button onClick={() => timer.switchMode("break")} disabled={timer.isRunning}>
                Break
              </button>
            </div>
          </div>

          <div style={{ fontSize: 76, fontWeight: 800, margin: "18px 0 10px" }}>
            {formatMMSS(timer.remainingSec)}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {!timer.isRunning ? (
              <button onClick={timer.start} style={{ fontWeight: 700 }}>
                Start
              </button>
            ) : (
              <button onClick={timer.pause} style={{ fontWeight: 700 }}>
                Pause
              </button>
            )}
            <button onClick={timer.reset}>Reset</button>
          </div>

          <div style={{ marginTop: 12, opacity: 0.8, fontSize: 13 }}>
            {timer.mode === "focus" ? (
              <>When Focus ends, the session is saved and you switch to Break automatically.</>
            ) : (
              <>When Break ends, you switch back to Focus automatically.</>
            )}
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 16,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Today’s plan</h3>
          <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.9 }}>
            <li>Pomodoro: <b>{settings.pomodoro_length}</b> min</li>
            <li>Break: <b>{settings.break_length}</b> min</li>
            <li>Daily goal: <b>{settings.daily_goal}</b> min</li>
          </ul>

          <p style={{ marginTop: 12, opacity: 0.8 }}>
            Change these in <b>Goals</b>.
          </p>
        </div>
      </div>
    </div>
  );
}
