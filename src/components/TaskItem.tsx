
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '../contexts/task/taskTypes';
import TaskCompletionMessage from './TaskCompletionMessage';
import TaskItemContent from './task/TaskItemContent';
import TaskItemActions from './task/TaskItemActions';
import SubtasksToggle from './task/SubtasksToggle';
import { getTaskCardClass } from './task/TaskItemStyleUtils';
import { useTaskTags } from './task/useTaskTags';

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
  const { taskTags, isLoadingTags } = useTaskTags(task.id);
  const [showSubtasks, setShowSubtasks] = useState(false);
  
  // Verificar se a tarefa tem recorrência
  const hasRecurrence = task.recurrence_type && task.recurrence_interval;
  
  // Verificar se a tarefa tem subtarefas
  const hasSubtasks = false; // Isso deve ser implementado no backend
  const isSubtask = !!task.parent_task_id;

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
          
          <TaskItemContent
            task={task}
            taskTags={taskTags}
            isLoadingTags={isLoadingTags}
            hasRecurrence={hasRecurrence}
            isSubtask={isSubtask}
          />
        </div>
        
        <SubtasksToggle 
          hasSubtasks={hasSubtasks}
          showSubtasks={showSubtasks}
          setShowSubtasks={setShowSubtasks}
        />
        
        <TaskItemActions
          task={task}
          currentTask={currentTask}
          timerState={timerState}
          onEditTask={onEditTask}
          onSelectTask={onSelectTask}
          onDeleteTask={onDeleteTask}
        />
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
