
import React, { useEffect } from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { useUser } from '@/contexts/user/UserContext';
import { toast } from 'sonner';

const TimerCompletion: React.FC = () => {
  const { timerState } = useTimer();
  const { addPoints } = useUser();

  useEffect(() => {
    // Check if timer has just completed (changed to idle state)
    if (timerState === 'idle') {
      handleTimerCompletion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerState]);

  const handleTimerCompletion = async () => {
    try {
      // Award points based on completed timer cycles
      // Focus session: 10 points
      // Break completed: 3-5 points
      const points = 10; // Default points for completing a session

      if (points > 0) {
        await addPoints(points);
      }
    } catch (error) {
      console.error('Error awarding points for timer completion:', error);
    }
  };

  // This is an invisible component just for handling the timer completion logic
  return null;
};

export default TimerCompletion;
