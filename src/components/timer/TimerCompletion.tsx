
import React from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { useToast } from '@/hooks/use-toast';

const TimerCompletion: React.FC = () => {
  const { timerState, timerType } = useTimer();
  const { toast } = useToast();

  React.useEffect(() => {
    // Show completion notification only when timer completes
    if (timerState === 'completed') {
      const message = timerType === 'work' 
        ? "Time to take a break! You've completed your focus session."
        : "Break time is over. Ready to focus again?";

      toast({
        title: "Timer Completed",
        description: message,
      });
    }
  }, [timerState, timerType, toast]);

  // This component doesn't render anything visible
  return null;
};

export default TimerCompletion;
