
import { Task } from '../taskTypes';

/**
 * Transform Supabase task data to our Task interface
 */
export const transformTaskData = (task: any): Task => ({
  id: task.id,
  name: task.name,
  estimatedTime: task.estimated_time,
  priority: task.priority as Task['priority'],
  completed: task.completed,
  createdAt: task.created_at,
  target_date: task.target_date
});
