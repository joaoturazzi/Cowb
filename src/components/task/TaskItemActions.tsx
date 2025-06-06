
import React from 'react';
import { Button } from '@/components/ui/button';
import { Task } from '@/contexts/task/taskTypes';
import { ArrowRight, Trash2, Pencil } from 'lucide-react';

interface TaskItemActionsProps {
  task: Task;
  currentTask: Task | null;
  timerState: string;
  onEditTask: (task: Task) => void;
  onSelectTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskItemActions: React.FC<TaskItemActionsProps> = ({
  task,
  currentTask,
  timerState,
  onEditTask,
  onSelectTask,
  onDeleteTask
}) => {
  return (
    <div className="flex items-center space-x-1">
      {!task.completed && (
        <>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEditTask(task)}
            className="h-6 w-6 p-0 rounded-full"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onSelectTask(task)}
            disabled={timerState === 'work' && currentTask?.id !== task.id}
            className="h-6 w-6 p-0 rounded-full"
          >
            <ArrowRight className="h-3 w-3" />
          </Button>
        </>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteTask(task.id)}
        className="h-6 w-6 p-0 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default TaskItemActions;
