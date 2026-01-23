import { useEffect, useState } from "react";
import type { FocusSession } from "../domain/models";
import { getAllSessions, deleteSession } from "../data/repositories/sessionsRepo";

export function useSessions() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const all = await getAllSessions();
    setSessions(all);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function remove(id: string) {
    await deleteSession(id);
    await refresh();
  }

  return { sessions, loading, refresh, remove };
}
