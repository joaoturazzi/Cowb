
import React from 'react';
import { Timer, X } from 'lucide-react';
import { Task } from '@/contexts';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  timeRemaining: number;
  timerModeLabel: string;
  progressPercent: number;
  completedPomodoros: number;
  pomodorosUntilLongBreak: number;
  currentTask: Task | null;
  formatTime: (seconds: number) => string;
  onClearTask?: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  timerModeLabel,
  progressPercent,
  completedPomodoros,
  pomodorosUntilLongBreak,
  currentTask,
  formatTime,
  onClearTask,
}) => {
  // Determine color based on timer mode
  const getTimerColor = () => {
    if (timerModeLabel.toLowerCase().includes('foco')) {
      return 'primary';
    } else if (timerModeLabel.toLowerCase().includes('pausa curta')) {
      return 'green-500';
    } else if (timerModeLabel.toLowerCase().includes('pausa longa')) {
      return 'blue-500';
    }
    return 'primary';
  };

  const timerColor = getTimerColor();
  
  return (
    <div className="flex flex-col">
      {currentTask && (
        <motion.div 
          className="text-center mb-2 animate-fade-in relative bg-muted/50 px-3 py-1 rounded-full text-xs"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-muted-foreground flex items-center justify-center">
            <Timer className="h-3 w-3 mr-1" /> 
            {currentTask.name}
            {onClearTask && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearTask}
                className="h-4 w-4 p-0 ml-1 rounded-full"
                title="Remover foco desta tarefa"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </span>
        </motion.div>
      )}

      <div className="flex items-center justify-center">
        <motion.div 
          className={cn("text-2xl font-medium", 
            timerColor === 'primary' 
              ? 'text-primary' 
              : timerColor === 'green-500' 
                ? 'text-green-500'
                : 'text-blue-500'
          )}
          key={timeRemaining}
          initial={{ scale: 1.05, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formatTime(timeRemaining)}
        </motion.div>
        
        <motion.div
          className={cn(
            "text-xs uppercase tracking-wider ml-2 font-medium",
            timerColor === 'primary' 
              ? 'text-primary/70' 
              : timerColor === 'green-500' 
                ? 'text-green-500/70'
                : 'text-blue-500/70'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {timerModeLabel}
        </motion.div>
      </div>

      {/* Pomodoro progress indicator */}
      <div className="flex justify-center gap-1 mt-1">
        {Array.from({ length: pomodorosUntilLongBreak }).map((_, index) => (
          <motion.div 
            key={index} 
            className={`w-1.5 h-1.5 rounded-full ${
              index < (completedPomodoros % pomodorosUntilLongBreak) 
                ? 'bg-primary' 
                : 'bg-muted'
            }`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

export default TimerDisplay;
