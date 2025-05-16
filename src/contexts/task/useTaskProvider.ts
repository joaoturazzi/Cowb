
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Task, DailySummary } from './taskTypes';
import * as taskService from './taskService';

export const useTaskProvider = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  const [dailySummary, setDailySummary] = useState<DailySummary>(() => {
    const today = new Date().toDateString();
    return { date: today, totalFocusedTime: 0, completedTasks: 0 };
  });

  // Fetch tasks from Supabase with improved initialization tracking
  useEffect(() => {
    let isMounted = true;
    
    const initializeProvider = async () => {
      if (isAuthenticated && user) {
        try {
          const result = await taskService.fetchTasks(user);
          
          // Only update state if component is still mounted
          if (isMounted) {
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
            
            // Mark initialization as complete
            setIsInitialized(true);
          }
        } catch (error: any) {
          console.error('Error fetching tasks:', error);
          if (isMounted) {
            toast({
              title: "Erro ao buscar tarefas",
              description: error.message || "Não foi possível carregar suas tarefas",
              variant: "destructive"
            });
            
            // Even on error, mark as initialized to prevent infinite loading
            setIsInitialized(true);
          }
        }
      } else {
        // If not authenticated, just initialize with empty state
        if (isMounted) {
          setTasks([]);
          setCurrentTask(null);
          setIsInitialized(true);
        }
      }
    };
    
    initializeProvider();
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, toast]);

  return {
    tasks,
    setTasks,
    currentTask,
    setCurrentTask,
    dailySummary,
    setDailySummary,
    toast,
    user,
    isInitialized
  };
};
