
import React from 'react';
import TaskListHeader from './TaskListHeader';
import TaskListContent from './tasks/TaskListContent';
import TaskListAuth from './tasks/TaskListAuth';
import EditTaskSheet from './EditTaskSheet';
import { useTaskList } from '@/hooks/useTaskList';
import { Skeleton } from './ui/skeleton';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const TaskList: React.FC = () => {
  const navigate = useNavigate();
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
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-7 w-1/3" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-4 w-3/4 mb-5" />
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
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
        <div className="flex justify-between items-center mb-4">
          <TaskListHeader />
          
          <Button 
            size="sm"
            className="flex items-center gap-1 bg-primary/90 hover:bg-primary text-white"
            onClick={() => navigate('/add-task')}
          >
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
        
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
