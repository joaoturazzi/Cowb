
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

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

export interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  pomodorosUntilLongBreak: number;
}

export type TimerState = 'idle' | 'work' | 'break' | 'longBreak' | 'paused';

interface AppContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  toggleTaskCompletion: (id: string) => void;
  clearCompletedTasks: () => void;
  removeTask: (id: string) => void;
  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;
  timerSettings: TimerSettings;
  updateTimerSettings: (settings: TimerSettings) => void;
  timerState: TimerState;
  setTimerState: (state: TimerState) => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  dailySummary: {
    totalFocusedTime: number;
    completedTasks: number;
  };
  updateFocusedTime: (time: number) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  completedPomodoros: number;
  incrementCompletedPomodoros: () => void;
  resetCompletedPomodoros: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const { toast } = useToast();
  
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(() => {
    const storedSettings = localStorage.getItem('timerSettings');
    return storedSettings 
      ? JSON.parse(storedSettings) 
      : { 
          workDuration: 25, 
          breakDuration: 5, 
          longBreakDuration: 15,
          pomodorosUntilLongBreak: 4
        };
  });
  
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timeRemaining, setTimeRemaining] = useState<number>(timerSettings.workDuration * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  
  const [dailySummary, setDailySummary] = useState(() => {
    const today = new Date().toDateString();
    return { date: today, totalFocusedTime: 0, completedTasks: 0 };
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  // Authentication state
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Check for existing session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        setIsLoading(false);
        return;
      }
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        setIsAuthenticated(true);
      }

      // Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, changedSession) => {
        setSession(changedSession);
        setUser(changedSession?.user ?? null);
        setIsAuthenticated(!!changedSession);

        if (event === 'SIGNED_IN' && changedSession) {
          // User signed in, fetch tasks
          fetchTasks();
        } else if (event === 'SIGNED_OUT') {
          // User signed out, clear tasks
          setTasks([]);
          setCurrentTask(null);
        }
      });
      
      // If authenticated, fetch tasks
      if (currentSession) {
        await fetchTasks();
      }
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);

  // Persist timer settings in localStorage
  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(timerSettings));
  }, [timerSettings]);

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Update completedPomodoros in localStorage
  useEffect(() => {
    localStorage.setItem('completedPomodoros', JSON.stringify(completedPomodoros));
  }, [completedPomodoros]);

  // Fetch tasks from Supabase
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
        const updates = oldTasks.map(task => ({
          id: task.id,
          target_date: today
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
      if (!isAuthenticated) {
        throw new Error("Você precisa estar autenticado para adicionar tarefas");
      }
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          name: task.name,
          estimated_time: task.estimatedTime,
          priority: task.priority,
          target_date: today
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

  const updateTimerSettings = (settings: TimerSettings) => {
    setTimerSettings(settings);
    setTimeRemaining(settings.workDuration * 60);
  };

  const updateFocusedTime = (time: number) => {
    setDailySummary(prev => ({
      ...prev,
      totalFocusedTime: prev.totalFocusedTime + time
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const incrementCompletedPomodoros = () => {
    setCompletedPomodoros(prev => prev + 1);
  };

  const resetCompletedPomodoros = () => {
    setCompletedPomodoros(0);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Não foi possível encerrar a sessão",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
    
    setIsAuthenticated(false);
    setUser(null);
    setSession(null);
    setTasks([]);
    setCurrentTask(null);
    return Promise.resolve();
  };

  const value = {
    tasks,
    addTask,
    toggleTaskCompletion,
    clearCompletedTasks,
    removeTask,
    currentTask,
    setCurrentTask,
    timerSettings,
    updateTimerSettings,
    timerState,
    setTimerState,
    timeRemaining,
    setTimeRemaining,
    dailySummary,
    updateFocusedTime,
    isDarkMode,
    toggleDarkMode,
    completedPomodoros,
    incrementCompletedPomodoros,
    resetCompletedPomodoros,
    isAuthenticated,
    setIsAuthenticated,
    user,
    signOut,
    isLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
