
import { useState } from 'react';
import { useTask, useTimer } from '@/contexts';
import { formatTime, getProgressPercent, getTimerModeLabel } from './timerUtils';
import { useTimerControls } from './useTimerControls';
import { useMessageLogic } from './useMessageLogic';
import { useTimerTaskHandling } from './useTimerTaskHandling';
import { useTimerCountdown } from './useTimerCountdown';

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

  // Get message handling logic
  const { 
    getContextualMessage, 
    getRandomMessage, 
    pomodoroMessages, 
    breakCompletionMessages, 
    longBreakMessages 
  } = useMessageLogic(completedPomodoros);

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

  // Get task handling logic
  const { clearCurrentTask } = useTimerTaskHandling({
    currentTask,
    setCurrentTask,
    timerState,
    setTimeRemaining
  });

  // Setup timer countdown effect
  useTimerCountdown({
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
  });

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
