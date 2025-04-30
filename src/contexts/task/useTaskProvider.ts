
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Task, DailySummary } from './taskTypes';
import * as taskService from './taskService';

export const useTaskProvider = () => {
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

  return {
    tasks,
    setTasks,
    currentTask,
    setCurrentTask,
    dailySummary,
    setDailySummary,
    toast,
    user
  };
};
