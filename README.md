# Study Planner / Pomodoro + Focus History

A Pomodoro focus timer with session history, daily goals, and weekly stats.

## Features (MVP)
- Pomodoro timer (25/5 + custom)
- Saves completed focus sessions
- Daily focus goal + progress bar
- History list by date
- Weekly focus chart + best focus time

## Data Model
**settings**
- pomodoro_length
- break_length
- daily_goal

**focus_sessions**
- id, start_time, end_time, duration, tag?

## Run locally
```bash
npm install
npm run dev
