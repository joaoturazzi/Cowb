
import React, { createContext, useState, useContext, useEffect } from 'react';

export type TimerState = 'idle' | 'work' | 'break' | 'longBreak' | 'paused';

export interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  pomodorosUntilLongBreak: number;
}

interface TimerContextType {
  timerSettings: TimerSettings;
  updateTimerSettings: (settings: TimerSettings) => void;
  timerState: TimerState;
  setTimerState: (state: TimerState) => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  completedPomodoros: number;
  incrementCompletedPomodoros: () => void;
  resetCompletedPomodoros: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  // Persist timer settings in localStorage
  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(timerSettings));
  }, [timerSettings]);

  // Update completedPomodoros in localStorage
  useEffect(() => {
    localStorage.setItem('completedPomodoros', JSON.stringify(completedPomodoros));
  }, [completedPomodoros]);

  const updateTimerSettings = (settings: TimerSettings) => {
    setTimerSettings(settings);
    setTimeRemaining(settings.workDuration * 60);
  };

  const incrementCompletedPomodoros = () => {
    setCompletedPomodoros(prev => prev + 1);
  };

  const resetCompletedPomodoros = () => {
    setCompletedPomodoros(0);
  };

  const value = {
    timerSettings,
    updateTimerSettings,
    timerState,
    setTimerState,
    timeRemaining,
    setTimeRemaining,
    completedPomodoros,
    incrementCompletedPomodoros,
    resetCompletedPomodoros,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
