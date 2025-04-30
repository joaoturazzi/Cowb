
import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Timer, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PomodoroTimer: React.FC = () => {
  const { 
    timerSettings, 
    updateTimerSettings, 
    timerState, 
    setTimerState, 
    timeRemaining, 
    setTimeRemaining,
    currentTask,
    updateFocusedTime
  } = useApp();
  
  const [elapsedWorkTime, setElapsedWorkTime] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState === 'work' || timerState === 'break') {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            // Timer completed
            if (timerState === 'work') {
              // Work session completed, move to break
              const workTime = timerSettings.workDuration * 60 - timeRemaining;
              setElapsedWorkTime(workTime);
              updateFocusedTime(Math.floor(workTime / 60));
              setTimerState('break');
              return timerSettings.breakDuration * 60;
            } else {
              // Break completed, back to work
              setTimerState('work');
              return timerSettings.workDuration * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, timerSettings, setTimeRemaining, setTimerState, updateFocusedTime]);

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

  const handleChangeTimerSettings = (preset: string) => {
    let newSettings;
    switch (preset) {
      case 'short':
        newSettings = { workDuration: 25, breakDuration: 5 };
        break;
      case 'medium':
        newSettings = { workDuration: 50, breakDuration: 10 };
        break;
      case 'long':
        newSettings = { workDuration: 90, breakDuration: 15 };
        break;
      default:
        newSettings = { workDuration: 25, breakDuration: 5 };
    }
    updateTimerSettings(newSettings);
    setTimerState('idle');
  };

  const timerModeLabel = timerState === 'break' ? 'Pausa' : 'Foco';
  const progressPercent = timerState === 'work' 
    ? ((timerSettings.workDuration * 60 - timeRemaining) / (timerSettings.workDuration * 60)) * 100
    : ((timerSettings.breakDuration * 60 - timeRemaining) / (timerSettings.breakDuration * 60)) * 100;

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
            <Button 
              onClick={handleResetTimer}
              size="icon"
              variant="secondary"
              className="btn-timer"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
