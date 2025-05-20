import React, { createContext, useContext } from 'react';
import { useTaskProvider } from './useTaskProvider';
import { Task, TaskContextType } from './taskTypes';
import { useAuth } from '../auth';

// Create Task Context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Task Provider Component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    isLoading,
    error,
    refreshTasks,
  } = useTaskProvider(user?.id ?? '');

  const value: TaskContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    isLoading,
    error,
    refreshTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom Hook for using Task Context
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
