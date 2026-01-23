import { useSessions } from "../hooks/useSessions";
import { minutesFromSeconds, toLocalDateKey } from "../utils/time";

export function HistoryPage() {
  const { sessions, loading, remove } = useSessions();

  const grouped = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    const key = toLocalDateKey(s.start_time);
    (acc[key] ||= []).push(s);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <h2>Sessions History</h2>

      {loading ? (
        <div>Loading…</div>
      ) : dates.length === 0 ? (
        <div>No sessions yet. Complete a focus session to save it.</div>
      ) : (
        dates.map((dateKey) => {
          const list = grouped[dateKey];
          const totalMin = list.reduce((sum, s) => sum + minutesFromSeconds(s.duration), 0);

          return (
            <div
              key={dateKey}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{dateKey}</div>
                  <div style={{ opacity: 0.75 }}>Total focused: {totalMin} min</div>
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                {list.map((s) => {
                  const start = new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  const mins = minutesFromSeconds(s.duration);
                  return (
                    <div
                      key={s.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderTop: "1px solid #eee",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div><b>{start}</b> • {mins} min</div>
                        {s.tag ? <div style={{ opacity: 0.75 }}>Tag: {s.tag}</div> : null}
                      </div>
                      <button onClick={() => remove(s.id)}>Delete</button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
