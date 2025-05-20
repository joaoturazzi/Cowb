
import React, { useEffect } from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { useUser } from '@/contexts/user/UserContext';
import { toast } from 'sonner';

const TimerCompletion: React.FC = () => {
  const { timerState, sessionType } = useTimer();
  const { addPoints } = useUser();

  useEffect(() => {
    // Check if timer has just completed
    if (timerState === 'completed') {
      handleTimerCompletion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerState]);

  const handleTimerCompletion = async () => {
    try {
      // Award points based on session type
      // Focus session: 10 points
      // Short break: 3 points
      // Long break: 5 points
      let points = 0;

      switch (sessionType) {
        case 'focus':
          points = 10;
          break;
        case 'shortBreak':
          points = 3;
          break;
        case 'longBreak':
          points = 5;
          break;
        default:
          points = 0;
      }

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
