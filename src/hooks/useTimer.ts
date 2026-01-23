import { useEffect, useMemo, useRef, useState } from "react";
import type { Settings } from "../domain/models";
import type { FocusSession } from "../domain/models";
import { addSession } from "../data/repositories/sessionsRepo";
import { uuid } from "../utils/uuid";

type Mode = "focus" | "break";

export function useTimer(settings: Settings | null) {
  const focusLenSec = useMemo(
    () => (settings ? Math.max(1, settings.pomodoro_length) * 60 : 25 * 60),
    [settings]
  );
  const breakLenSec = useMemo(
    () => (settings ? Math.max(1, settings.break_length) * 60 : 5 * 60),
    [settings]
  );

  const [mode, setMode] = useState<Mode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSec, setRemainingSec] = useState(focusLenSec);

  const intervalRef = useRef<number | null>(null);

  // For saving a completed focus session:
  const focusStartISORef = useRef<string | null>(null);

  // When settings change, reset lengths safely if not running
  useEffect(() => {
    if (!isRunning) {
      setRemainingSec(mode === "focus" ? focusLenSec : breakLenSec);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusLenSec, breakLenSec]);

  function clearTimer() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  async function onFocusCompleted() {
    const startISO = focusStartISORef.current;
    if (!startISO) return;

    const endISO = new Date().toISOString();
    const duration = focusLenSec; // seconds (full interval)
    const session: FocusSession = {
      id: uuid(),
      start_time: startISO,
      end_time: endISO,
      duration,
    };
    await addSession(session);
    focusStartISORef.current = null;
  }

  async function tick() {
    setRemainingSec((prev) => {
      if (prev <= 1) return 0;
      return prev - 1;
    });
  }

  // If remaining hits 0 while running, transition
  useEffect(() => {
    if (!isRunning) return;
    if (remainingSec !== 0) return;

    (async () => {
      clearTimer();
      setIsRunning(false);

      if (mode === "focus") {
        await onFocusCompleted();
        setMode("break");
        setRemainingSec(breakLenSec);
      } else {
        setMode("focus");
        setRemainingSec(focusLenSec);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSec, isRunning]);

  function start() {
    if (isRunning) return;

    // If starting focus, record start time if not already set
    if (mode === "focus" && !focusStartISORef.current) {
      focusStartISORef.current = new Date().toISOString();
    }

    setIsRunning(true);
    clearTimer();
    intervalRef.current = window.setInterval(() => {
      tick();
    }, 1000);
  }

  function pause() {
    setIsRunning(false);
    clearTimer();
  }

  function reset() {
    setIsRunning(false);
    clearTimer();
    setRemainingSec(mode === "focus" ? focusLenSec : breakLenSec);

    // If resetting during focus, discard the current session
    if (mode === "focus") {
      focusStartISORef.current = null;
    }
  }

  function switchMode(next: Mode) {
    setIsRunning(false);
    clearTimer();
    setMode(next);
    setRemainingSec(next === "focus" ? focusLenSec : breakLenSec);
    if (next === "focus") focusStartISORef.current = null;
  }

  return {
    mode,
    isRunning,
    remainingSec,
    focusLenSec,
    breakLenSec,
    start,
    pause,
    reset,
    switchMode,
  };
}
