
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../AuthContext';
import { Task, TaskContextType, DailySummary } from './taskTypes';
import * as taskService from './taskService';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  const [dailySummary, setDailySummary] = useState<DailySummary>(() => {
    const today = new Date().toDateString();
    return { date: today, totalFocusedTime: 0, completedTasks: 0 };
  });

  // Fetch tasks from Supabase
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTasks();
    } else {
      setTasks([]);
      setCurrentTask(null);
    }
  }, [isAuthenticated, user]);

  const fetchTasks = async () => {
    try {
      const result = await taskService.fetchTasks(user);
      
      if (result.movedTasksCount > 0) {
        toast({
          title: `${result.movedTasksCount} tarefas não concluídas`,
          description: "Tarefas de dias anteriores foram movidas para hoje",
        });
      }
      
      setTasks(result.tasks);
      
      // Set daily summary
      const completedTasksCount = result.tasks.filter(task => task.completed).length;
      setDailySummary(prev => ({
        ...prev,
        completedTasks: completedTasksCount
      }));
      
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Erro ao buscar tarefas",
        description: error.message || "Não foi possível carregar suas tarefas",
        variant: "destructive"
      });
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    try {
      const newTask = await taskService.addTask(user, task);
      setTasks([...tasks, newTask]);
      
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast({
        title: "Erro ao adicionar tarefa",
        description: error.message || "Não foi possível adicionar a tarefa",
        variant: "destructive"
      });
    }
  };

  const updateTask = async (id: string, updates: { name?: string; estimatedTime?: number; priority?: Task['priority'] }) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      
      // Update the tasks in state
      const updatedTasks = tasks.map(task => 
        task.id === id ? updatedTask : task
      );
      
      setTasks(updatedTasks);
      
      // Also update currentTask if it's the one being edited
      if (currentTask?.id === id) {
        setCurrentTask(updatedTask);
      }
      
      toast({
        title: "Tarefa atualizada",
        description: "As alterações foram salvas com sucesso",
      });
      
      return updatedTask;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: "Erro ao atualizar tarefa",
        description: error.message || "Não foi possível atualizar a tarefa",
        variant: "destructive"
      });
      throw error;
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      // Find the task to toggle
      const taskToToggle = tasks.find(task => task.id === id);
      if (!taskToToggle) return;
      
      const newCompletionState = await taskService.toggleTaskCompletion(id, taskToToggle.completed);
      
      // Update local state
      const updatedTasks = tasks.map(task => {
        if (task.id === id) {
          // If the task is being marked as completed, update the daily summary
          if (!task.completed) {
            setDailySummary(prev => ({
              ...prev,
              completedTasks: prev.completedTasks + 1
            }));
          } else {
            setDailySummary(prev => ({
              ...prev,
              completedTasks: Math.max(0, prev.completedTasks - 1)
            }));
          }
          return { ...task, completed: newCompletionState };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      
    } catch (error: any) {
      console.error('Error toggling task completion:', error);
      toast({
        title: "Erro ao atualizar tarefa",
        description: error.message || "Não foi possível atualizar o status da tarefa",
        variant: "destructive"
      });
    }
  };

  const clearCompletedTasks = async () => {
    try {
      // Get IDs of completed tasks
      const completedTaskIds = tasks
        .filter(task => task.completed)
        .map(task => task.id);
      
      const success = await taskService.clearCompletedTasks(completedTaskIds);
      
      if (success) {
        // Update local state
        setTasks(tasks.filter(task => !task.completed));
      }
      
    } catch (error: any) {
      console.error('Error clearing completed tasks:', error);
      toast({
        title: "Erro ao remover tarefas concluídas",
        description: error.message || "Não foi possível remover as tarefas concluídas",
        variant: "destructive"
      });
    }
  };

  const removeTask = async (id: string) => {
    try {
      const success = await taskService.removeTask(id);
      
      if (success) {
        // Update local state
        const taskToRemove = tasks.find(task => task.id === id);
        if (taskToRemove && taskToRemove.completed) {
          setDailySummary(prev => ({
            ...prev,
            completedTasks: Math.max(0, prev.completedTasks - 1)
          }));
        }
        
        setTasks(tasks.filter(task => task.id !== id));
      }
      
    } catch (error: any) {
      console.error('Error removing task:', error);
      toast({
        title: "Erro ao remover tarefa",
        description: error.message || "Não foi possível remover a tarefa",
        variant: "destructive"
      });
    }
  };

  const updateFocusedTime = (time: number) => {
    setDailySummary(prev => ({
      ...prev,
      totalFocusedTime: prev.totalFocusedTime + time
    }));
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
