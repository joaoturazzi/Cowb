
import React, { useEffect, useState } from 'react';
import { useTask, useTimer } from '../contexts';
import { Button } from '@/components/ui/button';
import { Play, Pause, Timer, ArrowRight, SkipForward } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const PomodoroTimer: React.FC = () => {
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

  const getTimerModeLabel = () => {
    switch (timerState) {
      case 'break':
        return 'Pausa';
      case 'longBreak':
        return 'Pausa Longa';
      default:
        return 'Foco';
    }
  };

  const getProgressPercent = () => {
    if (timerState === 'work') {
      return ((timerSettings.workDuration * 60 - timeRemaining) / (timerSettings.workDuration * 60)) * 100;
    } else if (timerState === 'break') {
      return ((timerSettings.breakDuration * 60 - timeRemaining) / (timerSettings.breakDuration * 60)) * 100;
    } else if (timerState === 'longBreak') {
      return ((timerSettings.longBreakDuration * 60 - timeRemaining) / (timerSettings.longBreakDuration * 60)) * 100;
    }
    return 0;
  };

  const timerModeLabel = getTimerModeLabel();
  const progressPercent = getProgressPercent();

  return (
    <div className="mb-8">
      <Tabs defaultValue="short" className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Temporizador</h2>
          <TabsList>
            <TabsTrigger value="short" onClick={() => handleChangeTimerSettings('short')}>
              25/5
            </TabsTrigger>
            <TabsTrigger value="medium" onClick={() => handleChangeTimerSettings('medium')}>
              50/10
            </TabsTrigger>
            <TabsTrigger value="long" onClick={() => handleChangeTimerSettings('long')}>
              90/15
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {currentTask && (
        <div className="text-center mb-2 animate-fade-in">
          <span className="text-muted-foreground text-sm flex items-center justify-center">
            <Timer className="h-3 w-3 mr-1" /> Trabalhando em: {currentTask.name}
          </span>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="relative mb-2">
          <div className="text-5xl font-light mb-1">{formatTime(timeRemaining)}</div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{timerModeLabel}</span>
        </div>

        {/* Pomodoro progress indicator */}
        <div className="flex gap-1 mb-2">
          {Array.from({ length: timerSettings.pomodorosUntilLongBreak }).map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full ${index < (completedPomodoros % timerSettings.pomodorosUntilLongBreak) ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
        
        {/* Timer progress bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-primary transition-all duration-500 ease-linear"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="flex gap-4">
          {timerState === 'idle' || timerState === 'paused' ? (
            <Button 
              onClick={handleStartTimer}
              size="icon"
              variant="default"
              className="btn-timer bg-primary hover:bg-primary/90"
            >
              <Play className="h-6 w-6" />
            </Button>
          ) : (
            <Button 
              onClick={handlePauseTimer}
              size="icon"
              variant="default"
              className="btn-timer bg-primary hover:bg-primary/90"
            >
              <Pause className="h-6 w-6" />
            </Button>
          )}
          
          {timerState !== 'idle' && (
            <>
              <Button 
                onClick={handleResetTimer}
                size="icon"
                variant="secondary"
                className="btn-timer"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
              
              <Button 
                onClick={handleSkipTimer}
                size="icon"
                variant="secondary"
                className="btn-timer"
                title={timerState === 'work' ? 'Pular para pausa' : 'Pular para foco'}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
