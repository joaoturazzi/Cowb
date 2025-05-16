
export interface PomodoroSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  session_type: 'work' | 'short_break' | 'long_break';
  task_id: string | null;
  planned_duration: number;
  actual_duration: number | null;
  status: 'completed' | 'interrupted' | 'in_progress';
  created_at: string;
}

export interface DailyProductivity {
  date: string;
  totalFocusTime: number;
  completedTasks: number;
  totalSessions: number;
}

export interface ProductivityTrend {
  period: string;
  focusTime: number;
  completedTasks: number;
}
