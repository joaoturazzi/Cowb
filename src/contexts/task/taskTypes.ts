
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
}

export interface DailySummary {
  date: string;
  totalFocusedTime: number;
  completedTasks: number;
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
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
