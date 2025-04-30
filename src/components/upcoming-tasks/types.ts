
import { Task } from '@/contexts/task/taskTypes';

export interface DayTasks {
  date: Date;
  formattedDate: string;
  tasks: Task[];
  isEmpty: boolean;
}

export interface TaskAction {
  onCheckTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}
