// Import any missing dependencies that caused errors
import { taskService } from './taskService';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '@/types';
import { useAuth } from '../AuthContext';

// Define the context type
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'completed' | 'created_at'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
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
      const fetchedTasks = await taskService.getTasks(user!.id);
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'user_id' | 'completed' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.createTask(user!.id, task);
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
      await taskService.updateTask(task);
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
      await taskService.deleteTask(id);
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
      await taskService.completeTask(id);
      await fetchTasks();
    } catch (err) {
      setError('Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    loading,
    error,
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
