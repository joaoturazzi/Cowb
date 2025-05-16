
import { Task } from '@/contexts/task/taskTypes';

export const getTaskCardClass = (task: Task): string => {
  if (task.completed) return 'task-card task-completed';
  
  switch (task.priority) {
    case 'high': return 'task-card task-high-priority';
    case 'medium': return 'task-card task-medium-priority';
    case 'low': return 'task-card task-low-priority';
    default: return 'task-card';
  }
};
