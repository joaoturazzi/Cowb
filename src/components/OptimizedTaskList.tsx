
import React from 'react';
import { useTaskList } from '@/hooks/useTaskList';
import TaskListHeader from './TaskListHeader';
import TaskListContent from './tasks/TaskListContent';
import TaskListAuth from './tasks/TaskListAuth';
import EditTaskSheet from './EditTaskSheet';

const OptimizedTaskList: React.FC = () => {
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
  } = useTaskList();
  
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

export default OptimizedTaskList;
