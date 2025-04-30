
// Format time in seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Calculate the progress percentage based on timer state and settings
export const getProgressPercent = (
  timerState: 'idle' | 'work' | 'break' | 'longBreak' | 'paused',
  timeRemaining: number,
  timerSettings: { 
    workDuration: number, 
    breakDuration: number, 
    longBreakDuration: number 
  }
): number => {
  if (timerState === 'work') {
    return ((timerSettings.workDuration * 60 - timeRemaining) / (timerSettings.workDuration * 60)) * 100;
  } else if (timerState === 'break') {
    return ((timerSettings.breakDuration * 60 - timeRemaining) / (timerSettings.breakDuration * 60)) * 100;
  } else if (timerState === 'longBreak') {
    return ((timerSettings.longBreakDuration * 60 - timeRemaining) / (timerSettings.longBreakDuration * 60)) * 100;
  }
  return 0;
};

// Get the contextual label for the timer mode
export const getTimerModeLabel = (timerState: 'idle' | 'work' | 'break' | 'longBreak' | 'paused'): string => {
  switch (timerState) {
    case 'break':
      return 'Pausa';
    case 'longBreak':
      return 'Pausa Longa';
    default:
      return 'Foco';
  }
};
