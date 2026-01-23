import { useEffect, useState } from "react";
import type { Settings } from "../domain/models";
import { getSettings, saveSettings } from "../data/repositories/settingsRepo";

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const s = await getSettings();
      setSettings(s);
      setLoading(false);
    })();
  }, []);

  async function updateSettings(next: Settings) {
    setSettings(next);
    await saveSettings(next);
  }

  return { settings, loading, updateSettings };
}
