
import { useState, useEffect } from 'react';
import { useTask, useTimer } from '../../contexts';
import { useToast } from '@/hooks/use-toast';
import { formatTime, getProgressPercent, getTimerModeLabel } from './timerUtils';
import { useTimerControls } from './useTimerControls';
import { useMessageLogic } from './useMessageLogic';

export const useTimerLogic = () => {
  const { 
    currentTask,
    updateFocusedTime,
    setCurrentTask
  } = useTask();
  
  const {
    settings: timerSettings,
    updateTimerSettings, 
    timerState, 
    setTimerState, 
    timeRemaining: timeLeft, 
    setTimeLeft: setTimeRemaining,
    completedPomodoros,
    incrementCompletedPomodoros,
    resetCompletedPomodoros
  } = useTimer();
  
  const [elapsedWorkTime, setElapsedWorkTime] = useState(0);
  const { toast } = useToast();

  // Get message handling logic
  const { getContextualMessage, getRandomMessage, pomodoroMessages, breakCompletionMessages, longBreakMessages } = useMessageLogic(completedPomodoros);

  // Get timer control handlers
  const timerControls = useTimerControls({
    timerState,
    setTimerState,
    timerSettings,
    setTimeRemaining,
    incrementCompletedPomodoros,
    completedPomodoros,
    resetCompletedPomodoros
  });

  // Clear current task function
  const clearCurrentTask = () => {
    setCurrentTask(null);
  };

  // Effect to update timer when a task is selected
  useEffect(() => {
    if (currentTask && timerState === 'idle') {
      // Set timer to the estimated time of the selected task
      setTimeRemaining(currentTask.estimatedTime * 60);
    }
  }, [currentTask, timerState, setTimeRemaining]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState === 'work' || timerState === 'short_break' || timerState === 'long_break') {
      interval = setInterval(() => {
        // Use a local variable to calculate the new time
        const newTime = timeLeft - 1;
        
        if (newTime <= 0) {
          // Timer completed
          if (timerState === 'work') {
            // Work session completed, move to break
            const workTime = timerSettings.workDuration * 60 - timeLeft;
            setElapsedWorkTime(workTime);
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
              
              toast({
                title: message.title,
                description: message.description,
              });
            } else {
              setTimerState('short_break');
              setTimeRemaining(timerSettings.shortBreakDuration * 60);
              
              // Show contextual message or default
              const contextMsg = getContextualMessage(currentTask);
              const message = contextMsg || getRandomMessage(pomodoroMessages);
              
              toast({
                title: message.title,
                description: message.description,
              });
            }
          } else if (timerState === 'short_break') {
            // Break completed, back to work
            setTimerState('work');
            setTimeRemaining(timerSettings.workDuration * 60);
            
            const message = getRandomMessage(breakCompletionMessages);
            toast({
              title: message.title,
              description: message.description,
            });
          } else if (timerState === 'long_break') {
            // Long break completed, back to work
            setTimerState('work');
            setTimeRemaining(timerSettings.workDuration * 60);
            
            const message = getRandomMessage(longBreakMessages);
            toast({
              title: message.title,
              description: message.description,
            });
          }
        } else {
          setTimeRemaining(newTime);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, timerSettings, timeLeft, setTimeRemaining, setTimerState, updateFocusedTime, completedPomodoros, incrementCompletedPomodoros, toast, currentTask]);

  // Handle timer settings change
  const handleChangeTimerSettings = (preset: string) => {
    const newSettings = timerControls.handleChangeTimerSettings(preset);
    updateTimerSettings(newSettings);
    setTimerState('idle');
    resetCompletedPomodoros();
  };

  return {
    currentTask,
    clearCurrentTask,
    timerSettings,
    timerState,
    timeRemaining: timeLeft,
    completedPomodoros,
    formatTime,
    handleStartTimer: timerControls.handleStartTimer,
    handlePauseTimer: timerControls.handlePauseTimer,
    handleResetTimer: timerControls.handleResetTimer,
    handleSkipTimer: timerControls.handleSkipTimer,
    handleChangeTimerSettings,
    getTimerModeLabel: () => getTimerModeLabel(timerState),
    getProgressPercent: () => getProgressPercent(timerState, timeLeft, timerSettings)
  };
};
