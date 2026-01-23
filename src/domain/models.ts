export type Settings = {
  pomodoro_length: number; // minutes
  break_length: number;    // minutes
  daily_goal: number;      // minutes
};

export type FocusSession = {
  id: string;
  start_time: string; // ISO
  end_time: string;   // ISO
  duration: number;   // seconds
  tag?: string;
};
