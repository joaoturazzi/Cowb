
export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  active: boolean;
  created_at: string;
  frequency_type: 'daily' | 'weekly' | 'specific_days';
  frequency_days: number[];
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  completed: boolean;
  created_at: string;
}

export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  completedToday: boolean;
  logs?: HabitLog[];
}
