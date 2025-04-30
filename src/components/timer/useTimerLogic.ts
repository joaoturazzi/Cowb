
import { useState, useEffect } from 'react';
import { useTask, useTimer } from '../../contexts';
import { useToast } from '@/hooks/use-toast';
import { TimerState } from '@/contexts';

export const useTimerLogic = () => {
  const { 
    currentTask,
    updateFocusedTime,
  } = useTask();
  
  const {
    timerSettings, 
    updateTimerSettings, 
    timerState, 
    setTimerState, 
    timeRemaining, 
    setTimeRemaining,
    completedPomodoros,
    incrementCompletedPomodoros,
    resetCompletedPomodoros
  } = useTimer();
  
  const [elapsedWorkTime, setElapsedWorkTime] = useState(0);
  const { toast } = useToast();

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState === 'work' || timerState === 'break' || timerState === 'longBreak') {
      interval = setInterval(() => {
        // Use a local variable to calculate the new time
        const newTime = timeRemaining - 1;
        
        if (newTime <= 0) {
          // Timer completed
          if (timerState === 'work') {
            // Work session completed, move to break
            const workTime = timerSettings.workDuration * 60 - timeRemaining;
            setElapsedWorkTime(workTime);
            updateFocusedTime(Math.floor(workTime / 60));
            
            // Increment completed pomodoros
            incrementCompletedPomodoros();
            
            // Check if we should take a long break
            const nextPomodoro = completedPomodoros + 1;
            if (nextPomodoro % timerSettings.pomodorosUntilLongBreak === 0) {
              setTimerState('longBreak');
              setTimeRemaining(timerSettings.longBreakDuration * 60);
              
              toast({
                title: "Tempo de trabalho concluído!",
                description: "Hora de fazer uma pausa longa.",
              });
            } else {
              setTimerState('break');
              setTimeRemaining(timerSettings.breakDuration * 60);
              
              toast({
                title: "Tempo de trabalho concluído!",
                description: "Hora de fazer uma pausa curta.",
              });
            }
          } else if (timerState === 'break') {
            // Break completed, back to work
            setTimerState('work');
            setTimeRemaining(timerSettings.workDuration * 60);
            
            toast({
              title: "Pausa concluída!",
              description: "Vamos voltar ao trabalho.",
            });
          } else if (timerState === 'longBreak') {
            // Long break completed, back to work
            setTimerState('work');
            setTimeRemaining(timerSettings.workDuration * 60);
            
            toast({
              title: "Pausa longa concluída!",
              description: "Vamos voltar ao trabalho com energia renovada.",
            });
          }
        } else {
          setTimeRemaining(newTime);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, timerSettings, timeRemaining, setTimeRemaining, setTimerState, updateFocusedTime, completedPomodoros, incrementCompletedPomodoros, toast]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    if (timerState === 'idle' || timerState === 'paused') {
      setTimerState('work');
    }
  };

  const handlePauseTimer = () => {
    setTimerState('paused');
  };

  const handleResetTimer = () => {
    setTimerState('idle');
    setTimeRemaining(timerSettings.workDuration * 60);
  };

  const handleSkipTimer = () => {
    if (timerState === 'work') {
      // Skip to break or long break
      incrementCompletedPomodoros();
      const nextPomodoro = completedPomodoros + 1;
      
      if (nextPomodoro % timerSettings.pomodorosUntilLongBreak === 0) {
        setTimerState('longBreak');
        setTimeRemaining(timerSettings.longBreakDuration * 60);
      } else {
        setTimerState('break');
        setTimeRemaining(timerSettings.breakDuration * 60);
      }
    } else if (timerState === 'break' || timerState === 'longBreak') {
      // Skip back to work
      setTimerState('work');
      setTimeRemaining(timerSettings.workDuration * 60);
    }
  };

  const handleChangeTimerSettings = (preset: string) => {
    let newSettings;
    switch (preset) {
      case 'short':
        newSettings = { 
          workDuration: 25, 
          breakDuration: 5, 
          longBreakDuration: 15, 
          pomodorosUntilLongBreak: 4 
        };
        break;
      case 'medium':
        newSettings = { 
          workDuration: 50, 
          breakDuration: 10, 
          longBreakDuration: 20, 
          pomodorosUntilLongBreak: 4 
        };
        break;
      case 'long':
        newSettings = { 
          workDuration: 90, 
          breakDuration: 15, 
          longBreakDuration: 30, 
          pomodorosUntilLongBreak: 4 
        };
        break;
      default:
        newSettings = { 
          workDuration: 25, 
          breakDuration: 5, 
          longBreakDuration: 15, 
          pomodorosUntilLongBreak: 4 
        };
    }
    updateTimerSettings(newSettings);
    setTimerState('idle');
    resetCompletedPomodoros();
  };

  const getTimerModeLabel = (): string => {
    switch (timerState) {
      case 'break':
        return 'Pausa';
      case 'longBreak':
        return 'Pausa Longa';
      default:
        return 'Foco';
    }
  };

  const getProgressPercent = (): number => {
    if (timerState === 'work') {
      return ((timerSettings.workDuration * 60 - timeRemaining) / (timerSettings.workDuration * 60)) * 100;
    } else if (timerState === 'break') {
      return ((timerSettings.breakDuration * 60 - timeRemaining) / (timerSettings.breakDuration * 60)) * 100;
    } else if (timerState === 'longBreak') {
      return ((timerSettings.longBreakDuration * 60 - timeRemaining) / (timerSettings.longBreakDuration * 60)) * 100;
    }
    return 0;
  };

  return {
    currentTask,
    timerSettings,
    timerState,
    timeRemaining,
    completedPomodoros,
    formatTime,
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer,
    handleSkipTimer,
    handleChangeTimerSettings,
    getTimerModeLabel,
    getProgressPercent
  };
};
