
import { TimerState, TimerSettings } from './timerTypes';
import { PomodoroSession } from '../analytics/analyticsTypes';
import { 
  startPomodoroSession, 
  completePomodoroSession, 
  interruptPomodoroSession 
} from '../analytics/analyticsService';
import { Task } from '../task/taskTypes';

interface TimerHandlersProps {
  timerState: TimerState;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  cycle: number;
  setCycle: React.Dispatch<React.SetStateAction<number>>;
  completedCycles: number;
  setCompletedCycles: React.Dispatch<React.SetStateAction<number>>;
  settings: TimerSettings;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  currentSession: PomodoroSession | null;
  setCurrentSession: React.Dispatch<React.SetStateAction<PomodoroSession | null>>;
  sessionStartTime: number | null;
  setSessionStartTime: React.Dispatch<React.SetStateAction<number | null>>;
  user: any;
  currentTask: Task | null;
  updateFocusedTime: (time: number) => void;
}

export const createTimerHandlers = ({
  timerState,
  setTimerState,
  isActive,
  setIsActive,
  cycle,
  setCycle,
  completedCycles,
  setCompletedCycles,
  settings,
  setTimeLeft,
  currentSession,
  setCurrentSession,
  sessionStartTime,
  setSessionStartTime,
  user,
  currentTask,
  updateFocusedTime
}: TimerHandlersProps) => {
  
  // Start timer handler
  const handleStartTimer = async () => {
    // If we're starting a work session, record it
    if (!isActive && timerState === 'work' && user) {
      try {
        const session = await startPomodoroSession(
          user.id,
          'work',
          currentTask?.id || null,
          settings.workDuration
        );
        
        setCurrentSession(session);
        setSessionStartTime(Date.now());
      } catch (error) {
        console.error('Error starting session:', error);
      }
    }
    
    setIsActive(true);
  };

  // Pause timer handler
  const handlePauseTimer = async () => {
    setIsActive(false);
    
    // If pausing a work session, record the time so far
    if (timerState === 'work' && currentSession && sessionStartTime) {
      try {
        const actualDuration = Math.round((Date.now() - sessionStartTime) / 1000);
        
        await interruptPomodoroSession(
          currentSession.id,
          actualDuration
        );
        
        setCurrentSession(null);
        setSessionStartTime(null);
      } catch (error) {
        console.error('Error interrupting session:', error);
      }
    }
  };

  // Reset timer handler
  const handleResetTimer = async () => {
    setIsActive(false);
    
    // If resetting a work session, record as interrupted
    if (timerState === 'work' && currentSession && sessionStartTime) {
      try {
        const actualDuration = Math.round((Date.now() - sessionStartTime) / 1000);
        
        await interruptPomodoroSession(
          currentSession.id,
          actualDuration
        );
        
        setCurrentSession(null);
        setSessionStartTime(null);
      } catch (error) {
        console.error('Error interrupting session:', error);
      }
    }
    
    // Reset timer based on current state
    switch (timerState) {
      case 'work':
        setTimeLeft(settings.workDuration);
        break;
      case 'short_break':
        setTimeLeft(settings.shortBreakDuration);
        break;
      case 'long_break':
        setTimeLeft(settings.longBreakDuration);
        break;
      default:
        setTimeLeft(settings.workDuration);
    }
  };

  // Skip to next timer state handler
  const handleSkipTimer = async () => {
    setIsActive(false);
    
    // If skipping a work session, record as interrupted
    if (timerState === 'work' && currentSession && sessionStartTime) {
      try {
        const actualDuration = Math.round((Date.now() - sessionStartTime) / 1000);
        
        await interruptPomodoroSession(
          currentSession.id,
          actualDuration
        );
        
        setCurrentSession(null);
        setSessionStartTime(null);
      } catch (error) {
        console.error('Error interrupting session:', error);
      }
    }
    
    // Advance to next state
    if (timerState === 'work') {
      if (cycle >= settings.cyclesBeforeLongBreak) {
        setTimerState('long_break');
        setCycle(1);
      } else {
        setTimerState('short_break');
        setCycle(cycle + 1);
      }
    } else {
      setTimerState('work');
    }
  };

  return {
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer,
    handleSkipTimer
  };
};
