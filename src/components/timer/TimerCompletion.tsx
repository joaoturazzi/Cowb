
import React from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { useToast } from '@/hooks/use-toast';

const TimerCompletion: React.FC = () => {
  const { timerState, settings } = useTimer();
  const { toast } = useToast();
  const timerType = timerState === 'work' ? 'work' : timerState === 'short_break' ? 'short_break' : 'long_break';

  React.useEffect(() => {
    // Show completion notification only when timer completes
    if (timerState === 'completed' || timerState === 'completed_work' || timerState === 'completed_break') {
      const isWorkTimer = timerState === 'completed_work' || (timerState === 'completed' && timerType === 'work');
      
      const message = isWorkTimer
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
