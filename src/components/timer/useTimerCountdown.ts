
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Task, TimerState, TimerSettings } from '@/contexts';

interface UseTimerCountdownProps {
  timerState: TimerState;
  timeLeft: number;
  setTimeRemaining: (time: number) => void;
  timerSettings: TimerSettings;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
  updateFocusedTime: (time: number) => void;
  completedPomodoros: number;
  incrementCompletedPomodoros: () => void;
  currentTask: Task | null;
  getContextualMessage: (task: Task | null) => { title: string; description: string; } | null;
  getRandomMessage: (messageArray: Array<{ title: string; description: string; }>) => { title: string; description: string; };
  pomodoroMessages: Array<{ title: string; description: string; }>;
  breakCompletionMessages: Array<{ title: string; description: string; }>;
  longBreakMessages: Array<{ title: string; description: string; }>;
}

export const useTimerCountdown = ({
  timerState,
  timeLeft,
  setTimeRemaining,
  timerSettings,
  setTimerState,
  updateFocusedTime,
  completedPomodoros,
  incrementCompletedPomodoros,
  currentTask,
  getContextualMessage,
  getRandomMessage,
  pomodoroMessages,
  breakCompletionMessages,
  longBreakMessages
}: UseTimerCountdownProps) => {
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

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    try {
      if (timerState === 'work' || timerState === 'short_break' || timerState === 'long_break') {
        interval = setInterval(() => {
          // Use a local variable to calculate the new time
          const newTime = timeLeft - 1;
          
          if (newTime <= 0) {
            // Timer completed
            if (timerState === 'work') {
              // Work session completed, move to break
              const workTime = timerSettings.workDuration * 60 - timeLeft;
              updateFocusedTime(Math.floor(workTime / 60));
              
              // Increment completed pomodoros
              incrementCompletedPomodoros();
              
              // Check if we should take a long break
              const nextPomodoro = completedPomodoros + 1;
              if (nextPomodoro % timerSettings.cyclesBeforeLongBreak === 0) {
                setTimerState('long_break');
                setTimeRemaining(timerSettings.longBreakDuration * 60);
                
                // Show contextual message or default
                const contextMsg = getContextualMessage(currentTask);
                const message = contextMsg || getRandomMessage(pomodoroMessages);
                
                safeToast({
                  title: message.title,
                  description: message.description,
                });
              } else {
                setTimerState('short_break');
                setTimeRemaining(timerSettings.shortBreakDuration * 60);
                
                // Show contextual message or default
                const contextMsg = getContextualMessage(currentTask);
                const message = contextMsg || getRandomMessage(pomodoroMessages);
                
                safeToast({
                  title: message.title,
                  description: message.description,
                });
              }
            } else if (timerState === 'short_break') {
              // Break completed, back to work
              setTimerState('work');
              setTimeRemaining(timerSettings.workDuration * 60);
              
              const message = getRandomMessage(breakCompletionMessages);
              safeToast({
                title: message.title,
                description: message.description,
              });
            } else if (timerState === 'long_break') {
              // Long break completed, back to work
              setTimerState('work');
              setTimeRemaining(timerSettings.workDuration * 60);
              
              const message = getRandomMessage(longBreakMessages);
              safeToast({
                title: message.title,
                description: message.description,
              });
            }
          } else {
            setTimeRemaining(newTime);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error in timer countdown:', error);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    timerState,
    timerSettings,
    timeLeft,
    setTimeRemaining,
    setTimerState,
    updateFocusedTime,
    completedPomodoros,
    incrementCompletedPomodoros,
    currentTask,
    getContextualMessage,
    getRandomMessage,
    pomodoroMessages,
    breakCompletionMessages,
    longBreakMessages
  ]);
};
