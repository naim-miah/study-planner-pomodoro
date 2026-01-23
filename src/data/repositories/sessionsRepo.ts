import type { FocusSession } from "../../domain/models";
import { getDB } from "../db";

export async function addSession(session: FocusSession): Promise<void> {
  const db = await getDB();
  await db.put("focus_sessions", session);
}

export async function getAllSessions(): Promise<FocusSession[]> {
  const db = await getDB();
  const all = await db.getAll("focus_sessions");
  // newest first
  return all.sort((a, b) => b.start_time.localeCompare(a.start_time));
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("focus_sessions", id);
}

