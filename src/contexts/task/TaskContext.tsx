
import React, { createContext, useContext } from 'react';
import { useTaskProvider } from './useTaskProvider';
import { Task, TaskContextType } from './taskTypes';
import { useAuth } from '../auth';
import { createTaskOperations } from './taskOperations';

// Create Task Context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Task Provider Component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const {
    tasks,
    setTasks,
    currentTask,
    setCurrentTask,
    dailySummary,
    setDailySummary,
    toast,
    isInitialized
  } = useTaskProvider();

  // Create task operations
  const {
    addTask,
    updateTask,
    toggleTaskCompletion: completeTask,
    clearCompletedTasks,
    removeTask: deleteTask,
    updateFocusedTime
  } = createTaskOperations(
    tasks,
    setTasks,
    setCurrentTask,
    setDailySummary,
    toast,
    user
  );

  const value: TaskContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    clearCompletedTasks,
    currentTask,
    setCurrentTask,
    dailySummary,
    updateFocusedTime,
    isLoading: !isInitialized,
    error: null,
    refreshTasks: () => {} // Not implemented but in the interface
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Create both naming variations to support existing code
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

// Add useTask alias for consistency with existing imports
export const useTask = useTasks;
