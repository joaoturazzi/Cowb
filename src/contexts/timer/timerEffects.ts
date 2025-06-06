
import { useEffect } from 'react';
import { TimerState, TimerSettings } from './timerTypes';
import { PomodoroSession } from '../analytics/analyticsTypes';
import { completePomodoroSession, startPomodoroSession } from '../analytics/analyticsService';
import { Task } from '../task/taskTypes';

interface UseTimerEffectsProps {
  isActive: boolean;
  timeLeft: number;
  timerState: TimerState;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  cycle: number;
  setCycle: React.Dispatch<React.SetStateAction<number>>;
  settings: TimerSettings;
  currentTask: Task | null;
  user: any;
  completedCycles: number;
  setCompletedCycles: React.Dispatch<React.SetStateAction<number>>;
  currentSession: PomodoroSession | null;
  setCurrentSession: React.Dispatch<React.SetStateAction<PomodoroSession | null>>;
  sessionStartTime: number | null;
  setSessionStartTime: React.Dispatch<React.SetStateAction<number | null>>;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
  updateFocusedTime: (time: number) => void;
}

export const useTimerEffects = ({
  isActive,
  timeLeft,
  timerState,
  setTimeLeft,
  cycle,
  setCycle,
  settings,
  currentTask,
  user,
  completedCycles,
  setCompletedCycles,
  currentSession,
  setCurrentSession,
  sessionStartTime,
  setSessionStartTime,
  setTimerState,
  updateFocusedTime
}: UseTimerEffectsProps) => {
  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      try {
        // When timer reaches zero
        
        // If in work period, record completed time
        if (timerState === 'work') {
          // Update statistics
          updateFocusedTime(settings.workDuration);
          setCompletedCycles(completedCycles + 1);
          
          // Record session completion
          if (currentSession && user) {
            completePomodoroSession(
              currentSession.id, 
              settings.workDuration
            ).catch(err => console.error('Error completing pomodoro session:', err));
          }
          
          // Determine next state
          if (cycle >= settings.cyclesBeforeLongBreak) {
            setTimerState('long_break');
            setCycle(1);
          } else {
            setTimerState('short_break');
            setCycle(cycle + 1);
          }
        } else {
          // If it was a break, return to work
          setTimerState('work');
          
          // Start new work session
          if (user) {
            startPomodoroSession(
              user.id,
              'work',
              currentTask?.id || null,
              settings.workDuration
            ).then(session => {
              setCurrentSession(session);
              setSessionStartTime(Date.now());
            }).catch(err => console.error('Error starting pomodoro session:', err));
          }
        }
      } catch (error) {
        console.error('Error in timer completion logic:', error);
        // Fallback to a safe state
        setTimerState('idle');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isActive, 
    timeLeft, 
    timerState, 
    cycle, 
    settings, 
    currentTask, 
    user, 
    completedCycles, 
    currentSession, 
    updateFocusedTime,
    setCycle,
    setCompletedCycles,
    setCurrentSession,
    setSessionStartTime,
    setTimerState
  ]);
};
