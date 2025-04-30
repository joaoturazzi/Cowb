
import React from 'react';
import { Timer } from 'lucide-react';
import { Task } from '@/contexts';

interface TimerDisplayProps {
  timeRemaining: number;
  timerModeLabel: string;
  progressPercent: number;
  completedPomodoros: number;
  pomodorosUntilLongBreak: number;
  currentTask: Task | null;
  formatTime: (seconds: number) => string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  timerModeLabel,
  progressPercent,
  completedPomodoros,
  pomodorosUntilLongBreak,
  currentTask,
  formatTime,
}) => {
  return (
    <div className="flex flex-col items-center">
      {currentTask && (
        <div className="text-center mb-2 animate-fade-in">
          <span className="text-muted-foreground text-sm flex items-center justify-center">
            <Timer className="h-3 w-3 mr-1" /> Trabalhando em: {currentTask.name}
          </span>
        </div>
      )}

      <div className="relative mb-2">
        <div className="text-5xl font-light mb-1">{formatTime(timeRemaining)}</div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{timerModeLabel}</span>
      </div>

      {/* Pomodoro progress indicator */}
      <div className="flex gap-1 mb-2">
        {Array.from({ length: pomodorosUntilLongBreak }).map((_, index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full ${index < (completedPomodoros % pomodorosUntilLongBreak) ? 'bg-primary' : 'bg-muted'}`}
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
    </div>
  );
};

export default TimerDisplay;
