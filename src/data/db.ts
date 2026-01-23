import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import type { FocusSession, Settings } from "../domain/models";

type StoredSettings = Settings & { key: "settings" };

interface FocusDB extends DBSchema {
  settings: {
    key: "settings";
    value: StoredSettings;
  };
  focus_sessions: {
    key: string; // id
    value: FocusSession;
    indexes: {
      "by_start_time": string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<FocusDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<FocusDB>("focus_timer_db", 1, {
      upgrade(db) {
        const settingsStore = db.createObjectStore("settings", { keyPath: "key" });

        // default settings
        settingsStore.put({
          key: "settings",
          pomodoro_length: 25,
          break_length: 5,
          daily_goal: 120,
        });

        const sessions = db.createObjectStore("focus_sessions", { keyPath: "id" });
        sessions.createIndex("by_start_time", "start_time");
      },
    });
  }
  return dbPromise;
}
