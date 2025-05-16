
import { TimerState, TimerSettings } from '@/contexts';
import React, { useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseTimerControlsProps {
  timerState: TimerState;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
  timerSettings: TimerSettings;
  setTimeRemaining: (time: number) => void;
  incrementCompletedPomodoros: () => void;
  completedPomodoros: number;
  resetCompletedPomodoros: () => void;
}

export const useTimerControls = ({
  timerState,
  setTimerState,
  timerSettings,
  setTimeRemaining,
  incrementCompletedPomodoros,
  completedPomodoros,
  resetCompletedPomodoros
}: UseTimerControlsProps) => {
  const isMounted = useRef(false);
  
  // Handle component mount state to avoid toast issues
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Safe toast function to prevent null errors
  const safeToast = (options: { title: string; description: string }) => {
    if (isMounted.current) {
      try {
        toast(options.title, { description: options.description });
      } catch (error) {
        console.error("Error showing toast notification:", error);
      }
    }
  };
  
  // Handler for starting the timer
  const handleStartTimer = () => {
    try {
      if (timerState === 'idle' || timerState === 'paused') {
        setTimerState('work');
      }
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  // Handler for pausing the timer
  const handlePauseTimer = () => {
    try {
      setTimerState('paused');
    } catch (error) {
      console.error('Error pausing timer:', error);
    }
  };

  // Handler for resetting the timer
  const handleResetTimer = () => {
    try {
      setTimerState('idle');
      setTimeRemaining(timerSettings.workDuration * 60);
    } catch (error) {
      console.error('Error resetting timer:', error);
    }
  };

  // Handler for skipping to next timer state
  const handleSkipTimer = () => {
    try {
      if (timerState === 'work') {
        // Skip to break or long break
        incrementCompletedPomodoros();
        const nextPomodoro = completedPomodoros + 1;
        
        if (nextPomodoro % timerSettings.cyclesBeforeLongBreak === 0) {
          setTimerState('long_break');
          setTimeRemaining(timerSettings.longBreakDuration * 60);
        } else {
          setTimerState('short_break');
          setTimeRemaining(timerSettings.shortBreakDuration * 60);
        }
      } else if (timerState === 'short_break' || timerState === 'long_break') {
        // Skip back to work
        setTimerState('work');
        setTimeRemaining(timerSettings.workDuration * 60);
      }
    } catch (error) {
      console.error('Error skipping timer:', error);
    }
  };

  // Handler for changing timer settings
  const handleChangeTimerSettings = (preset: string) => {
    try {
      let newSettings;
      switch (preset) {
        case 'short':
          newSettings = { 
            workDuration: 25, 
            shortBreakDuration: 5, 
            longBreakDuration: 15, 
            cyclesBeforeLongBreak: 4 
          };
          break;
        case 'medium':
          newSettings = { 
            workDuration: 50, 
            shortBreakDuration: 10, 
            longBreakDuration: 20, 
            cyclesBeforeLongBreak: 4 
          };
          break;
        case 'long':
          newSettings = { 
            workDuration: 90, 
            shortBreakDuration: 15, 
            longBreakDuration: 30, 
            cyclesBeforeLongBreak: 4 
          };
          break;
        default:
          newSettings = { 
            workDuration: 25, 
            shortBreakDuration: 5, 
            longBreakDuration: 15, 
            cyclesBeforeLongBreak: 4 
          };
      }
      
      // Return the new settings instead of directly updating them
      return newSettings;
    } catch (error) {
      console.error('Error changing timer settings:', error);
      // Return default settings if there was an error
      return { 
        workDuration: 25, 
        shortBreakDuration: 5, 
        longBreakDuration: 15, 
        cyclesBeforeLongBreak: 4 
      };
    }
  };

  return {
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer,
    handleSkipTimer,
    handleChangeTimerSettings
  };
};
