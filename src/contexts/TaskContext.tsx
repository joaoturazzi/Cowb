
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  estimatedTime: number;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  target_date?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  toggleTaskCompletion: (id: string) => void;
  clearCompletedTasks: () => void;
  removeTask: (id: string) => void;
  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;
  dailySummary: {
    totalFocusedTime: number;
    completedTasks: number;
  };
  updateFocusedTime: (time: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  const [dailySummary, setDailySummary] = useState(() => {
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
      // Check for uncompleted tasks from previous days and move them to today
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Find uncompleted tasks from previous days
      const { data: oldTasks, error: oldTasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('completed', false)
        .lt('target_date', today);
      
      if (oldTasksError) throw oldTasksError;
      
      // Update those tasks to today's date
      if (oldTasks && oldTasks.length > 0) {
        // Create an array of objects with update info
        const updates = oldTasks.map(task => ({
          id: task.id,
          target_date: today,
          // We need to include all required fields when updating
          name: task.name,
          estimated_time: task.estimated_time,
          priority: task.priority,
          user_id: task.user_id,
          completed: task.completed
        }));
        
        const { error: updateError } = await supabase
          .from('tasks')
          .upsert(updates);
        
        if (updateError) throw updateError;
        
        toast({
          title: `${oldTasks.length} tarefas não concluídas`,
          description: "Tarefas de dias anteriores foram movidas para hoje",
        });
      }
      
      // Fetch all tasks for today
      const { data: taskData, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('target_date', today)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Transform data to match our Task interface
      const transformedTasks: Task[] = taskData.map(task => ({
        id: task.id,
        name: task.name,
        estimatedTime: task.estimated_time,
        priority: task.priority as Priority,
        completed: task.completed,
        createdAt: task.created_at,
        target_date: task.target_date
      }));
      
      setTasks(transformedTasks);
      
      // Set daily summary
      const completedTasksCount = transformedTasks.filter(task => task.completed).length;
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
      if (!isAuthenticated || !user) {
        throw new Error("Você precisa estar autenticado para adicionar tarefas");
      }
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          name: task.name,
          estimated_time: task.estimatedTime,
          priority: task.priority,
          target_date: today,
          user_id: user.id
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Transform the returned data to match our Task interface
      const newTask: Task = {
        id: data.id,
        name: data.name,
        estimatedTime: data.estimated_time,
        priority: data.priority as Priority,
        completed: data.completed,
        createdAt: data.created_at,
        target_date: data.target_date
      };
      
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

  const toggleTaskCompletion = async (id: string) => {
    try {
      // Find the task to toggle
      const taskToToggle = tasks.find(task => task.id === id);
      if (!taskToToggle) return;
      
      // Update in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !taskToToggle.completed })
        .eq('id', id);
      
      if (error) throw error;
      
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
          return { ...task, completed: !task.completed };
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
      
      if (completedTaskIds.length === 0) return;
      
      // Delete from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', completedTaskIds);
      
      if (error) throw error;
      
      // Update local state
      setTasks(tasks.filter(task => !task.completed));
      
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
      // Delete from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const taskToRemove = tasks.find(task => task.id === id);
      if (taskToRemove && taskToRemove.completed) {
        setDailySummary(prev => ({
          ...prev,
          completedTasks: Math.max(0, prev.completedTasks - 1)
        }));
      }
      
      setTasks(tasks.filter(task => task.id !== id));
      
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

  const value = {
    tasks,
    addTask,
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
