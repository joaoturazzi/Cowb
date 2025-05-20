
import React, { useState, useEffect } from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { useToast } from '@/hooks/use-toast';

const TimerCompletion: React.FC = () => {
  const { timerState, settings } = useTimer();
  const { toast } = useToast();
  const [notifiedStates, setNotifiedStates] = useState<string[]>([]);
  
  // Define timer type based on current state
  const timerType = timerState === 'work' ? 'work' : 
                    timerState === 'short_break' ? 'short_break' : 
                    timerState === 'long_break' ? 'long_break' : '';

  useEffect(() => {
    // Check if we should show a notification based on timer completion
    const shouldShowWorkCompletion = timerState === 'idle' && notifiedStates.length === 0;
    const shouldShowBreakCompletion = timerState === 'idle' && notifiedStates.length === 0;
    
    // Only show notification if this state hasn't been notified before
    if ((shouldShowWorkCompletion || shouldShowBreakCompletion) && !notifiedStates.includes(timerState)) {
      // Determine message based on previous timer type
      const message = shouldShowWorkCompletion
        ? "Time to take a break! You've completed your focus session."
        : "Break time is over. Ready to focus again?";

      toast({
        title: "Timer Completed",
        description: message,
      });
      
      // Add this state to notified states to prevent duplicate notifications
      setNotifiedStates(prev => [...prev, timerState]);
    }
  }, [timerState, timerType, toast, notifiedStates]);

  // Reset notified states when timer goes back to idle
  useEffect(() => {
    if (timerState === 'idle') {
      setNotifiedStates([]);
    }
  }, [timerState]);

  // This component doesn't render anything visible
  return null;
};

export default TimerCompletion;
