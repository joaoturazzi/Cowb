
import { supabase } from '../../integrations/supabase/client';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  estimatedTime: number;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  target_date?: string;
  recurrence_type?: 'daily' | 'weekly' | 'monthly' | null;
  recurrence_interval?: number | null;
  recurrence_end_date?: string | null;
  parent_task_id?: string | null;
}

export interface DailySummary {
  date: string;
  totalFocusedTime: number;
  completedTasks: number;
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => Promise<Task>;
  updateTask: (id: string, updates: { name?: string; estimatedTime?: number; priority?: Priority }) => Promise<Task>;
  toggleTaskCompletion: (id: string) => void;
  clearCompletedTasks: () => void;
  removeTask: (id: string) => void;
  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;
  dailySummary: {
    totalFocusedTime: number;
    completedTasks: number;
  };
  updateFocusedTime: (time: number) => void;
}
