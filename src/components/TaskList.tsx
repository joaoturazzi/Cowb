
import React, { useState } from 'react';
import { useTask } from '../contexts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import EditTaskSheet from './EditTaskSheet';
import { Task } from '../contexts/task/taskTypes';
import CompletionPathIndicator from './CompletionPathIndicator';
import TaskListHeader from './TaskListHeader';
import EmptyTasksList from './EmptyTasksList';
import TaskProgress from './TaskProgress';
import TaskItem from './TaskItem';
import { useTaskList } from '@/hooks/useTaskList';

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
  } = useTaskList();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground mb-4">Faça login para visualizar e gerenciar suas tarefas</p>
        <Button onClick={() => navigate('/login')}>Fazer Login</Button>
      </div>
    );
  }
  
  return (
    <div>
      <TaskListHeader />
      
      {sortedTasks.length === 0 ? (
        <EmptyTasksList />
      ) : (
        <>
          {/* Completion Path Indicator */}
          <CompletionPathIndicator 
            remainingTime={remainingTime} 
            totalEstimatedTime={totalEstimatedTime}
            completedTime={completedTime}
          />
          
          <TaskProgress 
            completedTime={completedTime} 
            totalEstimatedTime={totalEstimatedTime} 
          />
          
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
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
            ))}
          </div>
        </>
      )}

      {taskToEdit && (
        <EditTaskSheet 
          task={taskToEdit} 
          isOpen={!!taskToEdit} 
          onClose={() => setTaskToEdit(null)} 
        />
      )}
    </div>
  );
};

export default TaskList;
