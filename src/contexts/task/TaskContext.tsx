
import React, { createContext, useContext } from 'react';
import { TaskContextType } from './taskTypes';
import { useTaskProvider } from './useTaskProvider';
import { createTaskOperations } from './taskOperations';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    tasks,
    setTasks,
    currentTask,
    setCurrentTask,
    dailySummary,
    setDailySummary,
    toast,
    user
  } = useTaskProvider();

  const {
    addTask,
    updateTask,
    toggleTaskCompletion,
    clearCompletedTasks,
    removeTask,
    updateFocusedTime
  } = createTaskOperations(tasks, setTasks, setCurrentTask, setDailySummary, toast, user);

  const value: TaskContextType = {
    tasks,
    addTask,
    updateTask,
    toggleTaskCompletion,
    clearCompletedTasks,
    removeTask,
    currentTask,
    setCurrentTask,
    dailySummary,
    updateFocusedTime,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
