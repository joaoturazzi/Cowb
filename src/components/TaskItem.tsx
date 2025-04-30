
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Task } from '../contexts/task/taskTypes';
import { Clock, ArrowRight, Trash2, Pencil } from 'lucide-react';
import TaskCompletionMessage from './TaskCompletionMessage';
import { formatMinutes } from '../utils/timeUtils';

interface TaskItemProps {
  task: Task;
  currentTask: Task | null;
  timerState: string;
  showCompletionMessage: string | null;
  completedTaskName: string;
  taskStreak: number;
  onCheckTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  currentTask,
  timerState,
  showCompletionMessage,
  completedTaskName,
  taskStreak,
  onCheckTask,
  onSelectTask,
  onEditTask,
  onDeleteTask
}) => {
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-tag priority-high';
      case 'medium': return 'priority-tag priority-medium';
      case 'low': return 'priority-tag priority-low';
      default: return 'priority-tag priority-low';
    }
  };

  // Get visual style for task card based on priority
  const getTaskCardClass = (task: Task) => {
    if (task.completed) return 'task-card task-completed';
    
    switch (task.priority) {
      case 'high': return 'task-card task-high-priority';
      case 'medium': return 'task-card task-medium-priority';
      case 'low': return 'task-card task-low-priority';
      default: return 'task-card';
    }
  };

  return (
    <div className="relative">
      <div className={getTaskCardClass(task)}>
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={task.completed}
            onCheckedChange={() => onCheckTask(task.id)}
            id={`task-${task.id}`}
            disabled={timerState === 'work' && currentTask?.id === task.id}
          />
          <div>
            <label 
              htmlFor={`task-${task.id}`}
              className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {task.name}
              {task.target_date && new Date(task.target_date).toDateString() !== new Date().toDateString() && (
                <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded-full">
                  Tarefa redistribuída
                </span>
              )}
            </label>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" /> 
                {formatMinutes(task.estimatedTime)}
              </span>
              <span className={getPriorityClass(task.priority)}>
                {task.priority === 'low' ? 'baixa' : task.priority === 'medium' ? 'média' : 'alta'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          {!task.completed && (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEditTask(task)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onSelectTask(task)}
                disabled={timerState === 'work' && currentTask?.id !== task.id}
                className="h-8 w-8 p-0 rounded-full"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteTask(task.id)}
            className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showCompletionMessage === task.id && (
        <TaskCompletionMessage 
          taskName={completedTaskName} 
          streak={taskStreak} 
        />
      )}
    </div>
  );
};

export default TaskItem;
