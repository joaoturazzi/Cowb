
import React from 'react';
import { Timer, X } from 'lucide-react';
import { Task } from '@/contexts';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="flex flex-col items-center">
      {currentTask && (
        <div className="text-center mb-4 animate-fade-in p-2 rounded-full bg-primary/10 transition-all">
          <span className="text-sm flex items-center justify-center text-primary">
            <Timer className="h-3 w-3 mr-1" /> 
            Trabalhando em: {currentTask.name}
            {onClearTask && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearTask}
                className="h-5 w-5 p-0 ml-1 hover:bg-primary/20"
                title="Remover foco desta tarefa"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </span>
        </div>
      )}

      <div className="relative mb-4 text-center">
        <div className="text-6xl font-light mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          {formatTime(timeRemaining)}
        </div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {timerModeLabel}
        </span>
      </div>

      {/* Pomodoro progress indicator with improved visual */}
      <div className="flex gap-1.5 mb-3 justify-center">
        {Array.from({ length: pomodorosUntilLongBreak }).map((_, index) => (
          <div 
            key={index} 
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index < (completedPomodoros % pomodorosUntilLongBreak) 
                ? 'bg-primary scale-110' 
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
      
      {/* Timer progress bar with animated gradient for focus */}
      <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden mb-6">
        <div
          className={`h-full transition-all duration-500 ease-linear rounded-full ${
            timerModeLabel.toLowerCase().includes("foco") 
              ? "bg-gradient-to-r from-primary via-primary/80 to-primary" 
              : "bg-primary"
          }`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TimerDisplay;
