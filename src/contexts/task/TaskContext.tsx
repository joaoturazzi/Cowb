// Import all task services correctly
import * as taskService from './taskService';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from './taskTypes';
import { useAuth } from '../AuthContext';

// Define the context type
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  // Add missing properties that other components are trying to use
  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;
  toggleTaskCompletion: (id: string) => void;
  removeTask: (id: string) => void;
  updateFocusedTime: (time: number) => void;
  dailySummary: {
    totalFocusedTime: number;
    completedTasks: number;
  };
}

// Fix the context type to include completeTask
const TaskContext = createContext<TaskContextType | null>(null);

// Custom hook to use the task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

// Provider component
export const useTaskProvider = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [dailySummary, setDailySummary] = useState<{
    totalFocusedTime: number;
    completedTasks: number;
  }>({ 
    totalFocusedTime: 0, 
    completedTasks: 0 
  });
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await taskService.fetchTasks(user!);
      setTasks(fetchedTasks.tasks);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.addTask(user, task);
      await fetchTasks();
    } catch (err) {
      setError('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (task: Task) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.updateTask(task.id, {
        name: task.name,
        estimatedTime: task.estimatedTime,
        priority: task.priority
      });
      await fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.removeTask(id);
      await fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // Find the task first to get its current completion status
      const taskToToggle = tasks.find(t => t.id === id);
      if (taskToToggle) {
        await taskService.toggleTaskCompletion(id, taskToToggle.completed);
        await fetchTasks();
      }
    } catch (err) {
      setError('Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  // Add missing methods that other components are trying to use
  const toggleTaskCompletion = (id: string) => {
    completeTask(id);
  };

  const removeTask = (id: string) => {
    deleteTask(id);
  };

  const updateFocusedTime = (time: number) => {
    setDailySummary(prev => ({
      ...prev,
      totalFocusedTime: prev.totalFocusedTime + time
    }));
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    loading,
    error,
    currentTask,
    setCurrentTask,
    toggleTaskCompletion,
    removeTask,
    updateFocusedTime,
    dailySummary
  };
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const taskProviderValue = useTaskProvider();

  return (
    <TaskContext.Provider value={taskProviderValue}>
      {children}
    </TaskContext.Provider>
  );
};
