import { useMemo } from "react";
import { useSessions } from "../hooks/useSessions";
import { minutesFromSeconds, toLocalDateKey } from "../utils/time";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function lastNDaysKeys(n: number) {
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.push(toLocalDateKey(d.toISOString()));
  }
  return keys;
}

export function StatsPage() {
  const { sessions, loading } = useSessions();

  const weeklyData = useMemo(() => {
    const keys = lastNDaysKeys(7);
    const totals: Record<string, number> = Object.fromEntries(keys.map((k) => [k, 0]));

    for (const s of sessions) {
      const k = toLocalDateKey(s.start_time);
      if (k in totals) totals[k] += minutesFromSeconds(s.duration);
    }

    return keys.map((k) => ({
      day: k.slice(5), // MM-DD
      minutes: totals[k],
    }));
  }, [sessions]);

  const bestHour = useMemo(() => {
    const byHour = Array.from({ length: 24 }, () => 0); // minutes
    for (const s of sessions) {
      const d = new Date(s.start_time);
      const h = d.getHours();
      byHour[h] += minutesFromSeconds(s.duration);
    }
    let best = 0;
    for (let h = 1; h < 24; h++) {
      if (byHour[h] > byHour[best]) best = h;
    }
    const label = `${String(best).padStart(2, "0")}:00–${String((best + 1) % 24).padStart(2, "0")}:00`;
    return { hour: best, label, minutes: byHour[best] };
  }, [sessions]);

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h2>Stats</h2>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, marginBottom: 12 }}>
            <h3 style={{ marginTop: 0 }}>Weekly focus (last 7 days)</h3>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="minutes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Best focus time</h3>
            <div>
              Most productive hour: <b>{bestHour.label}</b>
              {bestHour.minutes > 0 ? (
                <> (avg total saved: {bestHour.minutes} min)</>
              ) : (
                <> (no sessions yet)</>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

