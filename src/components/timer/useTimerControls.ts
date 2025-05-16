
import { TimerState, TimerSettings } from '@/contexts';

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
  
  // Handler for starting the timer
  const handleStartTimer = () => {
    if (timerState === 'idle' || timerState === 'paused') {
      setTimerState('work');
    }
  };

  // Handler for pausing the timer
  const handlePauseTimer = () => {
    setTimerState('paused');
  };

  // Handler for resetting the timer
  const handleResetTimer = () => {
    setTimerState('idle');
    setTimeRemaining(timerSettings.workDuration * 60);
  };

  // Handler for skipping to next timer state
  const handleSkipTimer = () => {
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
  };

  // Handler for changing timer settings
  const handleChangeTimerSettings = (preset: string) => {
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
  };

  return {
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer,
    handleSkipTimer,
    handleChangeTimerSettings
  };
};
