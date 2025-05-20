
import React from 'react';
import { Task } from '@/contexts/task/taskTypes';
import TaskProgress from '../TaskProgress';
import EmptyTasksList from '../EmptyTasksList';
import TaskItem from '../TaskItem';
import VirtualizedTaskList from '../VirtualizedTaskList';

interface TaskListContentProps {
  tasks: Task[];
  isEmpty: boolean;
  totalEstimatedTime: number;
  completedTime: number;
  remainingTime: number;
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

const TaskListContent: React.FC<TaskListContentProps> = ({
  tasks,
  isEmpty,
  totalEstimatedTime,
  completedTime,
  remainingTime,
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
  // Render task item for virtualized list
  const renderTaskItem = (task: Task, index: number) => (
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
  );
  
  if (isEmpty) {
    return <EmptyTasksList />;
  }
  
  return (
    <>
      <TaskProgress 
        completedTime={completedTime} 
        totalEstimatedTime={totalEstimatedTime} 
      />
      
      {tasks.length > 20 ? (
        <VirtualizedTaskList
          tasks={tasks}
          itemHeight={90} // Adjust based on your TaskItem height
          windowHeight={500} // Adjust based on your desired view height
          renderItem={renderTaskItem}
          className="space-y-3"
        />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => renderTaskItem(task, 0))}
        </div>
      )}
    </>
  );
};

export default TaskListContent;
