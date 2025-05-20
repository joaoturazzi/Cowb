
import React, { createContext, useContext, useEffect, useState } from 'react';
import { TaskContextType, Task } from './taskTypes';
import { useTaskProvider } from './useTaskProvider';
import { createTaskOperations } from './taskOperations';
import { useAuth } from '../AuthContext';
import { useUser } from '../user/UserContext';
import * as taskService from './taskService';

// Create a default context value to avoid the "undefined" error
const defaultContextValue: TaskContextType = {
  tasks: [],
  addTask: async () => {
    throw new Error('TaskProvider not initialized');
  },
  updateTask: async () => {
    throw new Error('TaskProvider not initialized');
  },
  toggleTaskCompletion: async () => {
    throw new Error('TaskProvider not initialized');
  },
  clearCompletedTasks: async () => {
    throw new Error('TaskProvider not initialized');
  },
  removeTask: async () => {
    throw new Error('TaskProvider not initialized');
  },
  currentTask: null,
  setCurrentTask: () => {},
  dailySummary: { totalFocusedTime: 0, completedTasks: 0 },
  updateFocusedTime: async () => {
    throw new Error('TaskProvider not initialized');
  },
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

  const { user: authUser } = useAuth();
  const { addPoints } = useUser();

  // Helper function to complete tasks
  const handleTaskCompletion = async (taskId: string, completed: boolean = true): Promise<boolean> => {
    try {
      // Store the current state to revert on error
      const previousTasks = [...tasks];
      
      // Update local state optimistically
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === taskId) {
            return { ...task, completed };
          }
          return task;
        })
      );
      
      // Call API and update the task in the database
      const success = await taskService.toggleTaskCompletion(taskId, completed);
      
      if (success) {
        // If completing (not uncompleting), add points
        if (completed) {
          // Calculate points based on task priority
          // High priority: 10 points, Medium: 5, Low: 3
          const task = tasks.find(t => t.id === taskId);
          let points = 5; // Default (medium)
          
          if (task) {
            if (task.priority === 'high') points = 10;
            if (task.priority === 'low') points = 3;
          }
          
          // Add points to user profile
          await addPoints(points);
        }
        return true;
      } else {
        // Revert the state if the API call fails
        setTasks(previousTasks);
        return false;
      }
    } catch (error) {
      console.error('Error completing task:', error);
      return false;
    }
  };

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
    updateFocusedTime
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
