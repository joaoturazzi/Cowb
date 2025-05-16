
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

  return (
    <div className="flex-1">
      <div className="flex items-center">
        <label 
          htmlFor={`task-${task.id}`}
          className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''} ${isSubtask ? 'text-sm' : ''}`}
        >
          {task.name}
        </label>
        
        {/* Ícone de recorrência se aplicável */}
        {hasRecurrence && (
          <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded-full">
            Recorrente
          </span>
        )}
        
        {/* Indicador de tarefa redistribuída */}
        {task.target_date && new Date(task.target_date).toDateString() !== new Date().toDateString() && (
          <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded-full">
            Tarefa redistribuída
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
        <span className="flex items-center">
          <Clock className="h-3 w-3 mr-1" /> 
          {formatMinutes(task.estimatedTime)}
        </span>
        <span className={getPriorityClass(task.priority)}>
          {task.priority === 'low' ? 'baixa' : task.priority === 'medium' ? 'média' : 'alta'}
        </span>
      </div>
      
      {/* Exibir tags da tarefa */}
      <TaskItemTags tags={taskTags} isLoading={isLoadingTags} />
    </div>
  );
};

export default TaskItemContent;
