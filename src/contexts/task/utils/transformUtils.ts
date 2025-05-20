
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
  target_date: task.target_date,
  recurrence_type: task.recurrence_type,
  recurrence_interval: task.recurrence_interval,
  recurrence_end_date: task.recurrence_end_date,
  parent_task_id: task.parent_task_id
});
