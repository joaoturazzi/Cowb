
// Format time in seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Calculate the progress percentage based on timer state and settings
export const getProgressPercent = (
  timerState: 'idle' | 'work' | 'short_break' | 'long_break' | 'paused',
  timeRemaining: number,
  timerSettings: { 
    workDuration: number, 
    shortBreakDuration: number, 
    longBreakDuration: number 
  }
): number => {
  if (timerState === 'work') {
    return ((timerSettings.workDuration * 60 - timeRemaining) / (timerSettings.workDuration * 60)) * 100;
  } else if (timerState === 'short_break') {
    return ((timerSettings.shortBreakDuration * 60 - timeRemaining) / (timerSettings.shortBreakDuration * 60)) * 100;
  } else if (timerState === 'long_break') {
    return ((timerSettings.longBreakDuration * 60 - timeRemaining) / (timerSettings.longBreakDuration * 60)) * 100;
  }
  return 0;
};

// Get the contextual label for the timer mode
export const getTimerModeLabel = (timerState: 'idle' | 'work' | 'short_break' | 'long_break' | 'paused'): string => {
  switch (timerState) {
    case 'short_break':
      return 'Pausa';
    case 'long_break':
      return 'Pausa Longa';
    default:
      return 'Foco';
  }
};
