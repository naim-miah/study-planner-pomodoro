# Study Planner / Pomodoro + Focus History

A Pomodoro focus timer that saves completed focus sessions, tracks daily goals, and shows weekly stats.

## MVP Features
- Pomodoro timer (25/5 + custom)
- Save every completed focus session
- Daily goal progress bar
- History list (date, duration)
- Weekly focus chart + best focus time

## Data Model
**settings**
- pomodoro_length, break_length, daily_goal

**focus_sessions**
- id, start_time, end_time, duration, tag (optional)

## Run locally
```bash
npm install
npm run dev

