
import { useEffect } from 'react';
import { Task, TimerState } from '@/contexts';

interface UseTimerTaskHandlingProps {
  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;
  timerState: TimerState;
  setTimeRemaining: (time: number) => void;
}

export const useTimerTaskHandling = ({
  currentTask,
  setCurrentTask,
  timerState,
  setTimeRemaining
}: UseTimerTaskHandlingProps) => {
  
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

  return {
    clearCurrentTask
  };
};
