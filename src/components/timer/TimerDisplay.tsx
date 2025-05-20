
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
    <div className="flex flex-col items-center">
      {currentTask && (
        <motion.div 
          className="text-center mb-4 animate-fade-in relative bg-muted/50 px-4 py-2 rounded-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-muted-foreground text-sm flex items-center justify-center">
            <Timer className="h-3 w-3 mr-1" /> 
            Trabalhando em: {currentTask.name}
            {onClearTask && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearTask}
                className="h-5 w-5 p-0 ml-1 rounded-full"
                title="Remover foco desta tarefa"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </span>
        </motion.div>
      )}

      <div className="relative mb-6">
        {/* Circular timer */}
        <div className="w-60 h-60 relative flex items-center justify-center">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full bg-muted"></div>
          
          {/* Progress circle with clip-path */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="47%"
              className={`fill-none stroke-current stroke-[8px] transition-all duration-500 ease-linear ${
                timerColor === 'primary' 
                  ? 'stroke-primary' 
                  : timerColor === 'green-500' 
                    ? 'stroke-green-500'
                    : 'stroke-blue-500'
              }`}
              strokeDasharray="100 100"
              strokeDashoffset={100 - progressPercent}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Inner content */}
          <div className="z-10 text-center">
            <motion.div 
              className="text-5xl font-medium"
              key={timeRemaining}
              initial={{ scale: 1.05, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {formatTime(timeRemaining)}
            </motion.div>
            <motion.div
              className={cn(
                "text-sm uppercase tracking-wider mt-2 font-medium",
                timerColor === 'primary' 
                  ? 'text-primary' 
                  : timerColor === 'green-500' 
                    ? 'text-green-500'
                    : 'text-blue-500'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {timerModeLabel}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Pomodoro progress indicator */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: pomodorosUntilLongBreak }).map((_, index) => (
          <motion.div 
            key={index} 
            className={`w-2 h-2 rounded-full ${
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
