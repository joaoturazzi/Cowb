
import React, { createContext, useContext } from 'react';
import { TaskContextType } from './taskTypes';
import { useTaskProvider } from './useTaskProvider';
import { createTaskOperations } from './taskOperations';

// Create a default context value to avoid the "undefined" error
const defaultContextValue: TaskContextType = {
  tasks: [],
  addTask: async () => ({ success: false, error: 'TaskProvider not initialized' }),
  updateTask: async () => ({ success: false, error: 'TaskProvider not initialized' }),
  toggleTaskCompletion: async () => ({ success: false, error: 'TaskProvider not initialized' }),
  clearCompletedTasks: async () => ({ success: false, error: 'TaskProvider not initialized' }),
  removeTask: async () => ({ success: false, error: 'TaskProvider not initialized' }),
  currentTask: null,
  setCurrentTask: () => {},
  dailySummary: { date: new Date().toDateString(), totalFocusedTime: 0, completedTasks: 0 },
  updateFocusedTime: async () => ({ success: false, error: 'TaskProvider not initialized' }),
};

const TaskContext = createContext<TaskContextType>(defaultContextValue);

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
  if (!context) {
    console.error("useTask must be used within a TaskProvider. Check component hierarchy.");
    // Return the default context instead of throwing an error
    // This allows the app to continue running with default values
    return defaultContextValue;
  }
  return context;
};
