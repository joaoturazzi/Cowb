
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  estimatedTime: number;
  priority: Priority;
  completed: boolean;
  createdAt: string;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  
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
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(() => {
    const stored = localStorage.getItem('completedPomodoros');
    return stored ? JSON.parse(stored) : 0;
  });
  
  const [dailySummary, setDailySummary] = useState(() => {
    const storedSummary = localStorage.getItem('dailySummary');
    const today = new Date().toDateString();
    const savedSummary = storedSummary ? JSON.parse(storedSummary) : { date: '', totalFocusedTime: 0, completedTasks: 0 };
    
    // Reset daily summary if it's a new day
    if (savedSummary.date !== today) {
      return { date: today, totalFocusedTime: 0, completedTasks: 0 };
    }
    return savedSummary;
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(timerSettings));
  }, [timerSettings]);

  useEffect(() => {
    localStorage.setItem('dailySummary', JSON.stringify(dailySummary));
  }, [dailySummary]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('completedPomodoros', JSON.stringify(completedPomodoros));
  }, [completedPomodoros]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
      ...task,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        // If the task is being marked as completed, update the daily summary
        if (!task.completed) {
          setDailySummary(prev => ({
            ...prev,
            completedTasks: prev.completedTasks + 1
          }));
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
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
    resetCompletedPomodoros
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
