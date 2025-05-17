
import { useEffect, useRef } from 'react';
import { Task, TimerState } from '@/contexts';
import { toast } from 'sonner';

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
        // Fallback to console log if toast fails
        console.log(`Toast: ${options.title} - ${options.description}`);
      }
    }
  };
  
  // Clear current task function
  const clearCurrentTask = () => {
    try {
      setCurrentTask(null);
      if (isMounted.current) {
        safeToast({
          title: "Tarefa removida",
          description: "A tarefa atual foi removida do timer"
        });
      }
    } catch (error) {
      console.error('Error clearing current task:', error);
    }
  };

  // Effect to update timer when a task is selected
  useEffect(() => {
    try {
      if (currentTask && timerState === 'idle') {
        // Set timer to the estimated time of the selected task
        setTimeRemaining(currentTask.estimatedTime * 60);
      }
    } catch (error) {
      console.error('Error updating timer with task time:', error);
    }
  }, [currentTask, timerState, setTimeRemaining]);

  return {
    clearCurrentTask
  };
};
