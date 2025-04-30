
import React from 'react';
import { Task } from '@/contexts/task/taskTypes';
import TaskItem from '../TaskItem';

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  badgeText?: string;
  badgeColor?: string;
  isCompleted?: boolean;
  timerState: string;
  currentTask: Task | null;
  showCompletionMessage: string | null;
  completedTaskName: string;
  taskStreak: number;
  onCheckTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  tasks,
  badgeText,
  badgeColor,
  isCompleted = false,
  timerState,
  currentTask,
  showCompletionMessage,
  completedTaskName,
  taskStreak,
  onCheckTask,
  onSelectTask,
  onEditTask,
  onDeleteTask
}) => {
  if (tasks.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-t pt-4">
        <h3 className="text-sm font-medium text-foreground flex items-center">
          <div className={`w-2 h-2 ${isCompleted ? 'bg-green-500' : 'bg-primary'} rounded-full mr-2`}></div>
          {title} ({tasks.length})
        </h3>
        {badgeText && (
          <span className={`text-xs ${badgeColor} px-2 py-1 rounded-md font-medium`}>
            {badgeText}
          </span>
        )}
      </div>
      
      <div className={isCompleted ? "opacity-80 space-y-3" : "space-y-3"}>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            currentTask={currentTask}
            timerState={timerState}
            showCompletionMessage={showCompletionMessage}
            completedTaskName={completedTaskName}
            taskStreak={taskStreak}
            onCheckTask={onCheckTask}
            onSelectTask={onSelectTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskSection;
