
import React from 'react';
import { Task } from '@/contexts/task/taskTypes';
import { Clock } from 'lucide-react';
import { formatMinutes } from '../../utils/timeUtils';
import { Tag } from '@/contexts/task/types/tagTypes';
import TaskItemTags from './TaskItemTags';

interface TaskItemContentProps {
  task: Task;
  taskTags: Tag[];
  isLoadingTags: boolean;
  hasRecurrence: boolean;
  isSubtask: boolean;
}

const TaskItemContent: React.FC<TaskItemContentProps> = ({
  task,
  taskTags,
  isLoadingTags,
  hasRecurrence,
  isSubtask
}) => {
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-tag priority-high';
      case 'medium': return 'priority-tag priority-medium';
      case 'low': return 'priority-tag priority-low';
      default: return 'priority-tag priority-low';
    }
  };
  
  // Truncate task name if it's too long
  const truncateText = (text: string, maxLength = 40) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center">
        <label 
          htmlFor={`task-${task.id}`}
          className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''} ${isSubtask ? 'text-xs' : 'text-sm'}`}
          title={task.name} // Show full name on hover
        >
          {truncateText(task.name)}
        </label>
        
        {hasRecurrence && (
          <span className="ml-1 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-1 py-0.5 rounded-full flex-shrink-0">
            R
          </span>
        )}
        
        {task.target_date && new Date(task.target_date).toDateString() !== new Date().toDateString() && (
          <span className="ml-1 text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-1 py-0.5 rounded-full flex-shrink-0">
            ↺
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5 flex-wrap">
        <span className="flex items-center flex-shrink-0">
          <Clock className="h-2.5 w-2.5 mr-0.5" /> 
          {formatMinutes(task.estimatedTime)}
        </span>
        <span className={getPriorityClass(task.priority) + " text-[10px] px-1"}>
          {task.priority === 'low' ? 'baixa' : task.priority === 'medium' ? 'média' : 'alta'}
        </span>
      </div>
      
      <TaskItemTags tags={taskTags} isLoading={isLoadingTags} />
    </div>
  );
};

export default TaskItemContent;
