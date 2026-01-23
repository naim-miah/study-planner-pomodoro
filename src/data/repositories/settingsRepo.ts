import type { Settings } from "../../domain/models";
import { getDB } from "../db";

export async function getSettings(): Promise<Settings> {
  const db = await getDB();
  const s = await db.get("settings", "settings");
  // DB always seeded, but guard anyway:
  return (
    s ?? { pomodoro_length: 25, break_length: 5, daily_goal: 120 }
  );
}

export async function saveSettings(next: Settings): Promise<void> {
  const db = await getDB();
  await db.put("settings", { key: "settings", ...next });
}
