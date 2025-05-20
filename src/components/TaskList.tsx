
import React from 'react';
import TaskListHeader from './TaskListHeader';
import TaskListContent from './tasks/TaskListContent';
import TaskListAuth from './tasks/TaskListAuth';
import EditTaskSheet from './EditTaskSheet';
import { useTaskList } from '@/hooks/useTaskList';
import { Skeleton } from './ui/skeleton';

const TaskList: React.FC = () => {
  const {
    isAuthenticated,
    timerState,
    currentTask,
    sortedTasks,
    totalEstimatedTime,
    completedTime,
    remainingTime,
    showCompletionMessage,
    completedTaskName,
    taskStreak,
    taskToEdit,
    navigate,
    setTaskToEdit,
    handleTaskSelect,
    handleTaskCheck,
    handleDeleteTask,
    handleEditTask,
    isLoading,
  } = useTaskList();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-2 mt-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <TaskListAuth 
        isAuthenticated={isAuthenticated} 
        onLogin={() => navigate('/login')}
      >
        <TaskListHeader />
        
        <TaskListContent
          tasks={sortedTasks}
          isEmpty={sortedTasks.length === 0}
          totalEstimatedTime={totalEstimatedTime}
          completedTime={completedTime}
          remainingTime={remainingTime}
          currentTask={currentTask}
          timerState={timerState}
          showCompletionMessage={showCompletionMessage}
          completedTaskName={completedTaskName}
          taskStreak={taskStreak}
          onCheckTask={handleTaskCheck}
          onSelectTask={handleTaskSelect}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />

        {taskToEdit && (
          <EditTaskSheet 
            task={taskToEdit} 
            isOpen={!!taskToEdit} 
            onClose={() => setTaskToEdit(null)} 
          />
        )}
      </TaskListAuth>
    </div>
  );
};

export default TaskList;
