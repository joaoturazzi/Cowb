
import { Task } from '@/contexts/task/taskTypes';

export const getTaskCardClass = (task: Task): string => {
  const baseClass = 'task-card p-2 px-3 flex items-center justify-between rounded-lg border shadow-sm hover:shadow bg-card relative gap-3';
  
  if (task.completed) {
    return `${baseClass} bg-muted/30 border-muted task-completed`;
  }
  
  switch (task.priority) {
    case 'high': 
      return `${baseClass} border-red-200 dark:border-red-800/30 task-high-priority`;
    case 'medium': 
      return `${baseClass} border-amber-200 dark:border-amber-800/30 task-medium-priority`;
    case 'low': 
      return `${baseClass} border-green-200 dark:border-green-800/30 task-low-priority`;
    default: 
      return `${baseClass} task-low-priority`;
  }
};
