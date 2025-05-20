
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, RefreshCcw } from 'lucide-react';
import { TimerState } from '@/contexts';
import { cn } from '@/lib/utils';

interface TimerControlsProps {
  timerState: TimerState;
  handleStartTimer: () => void;
  handlePauseTimer: () => void;
  handleResetTimer: () => void;
  handleSkipTimer: () => void;
  compact?: boolean;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  timerState,
  handleStartTimer,
  handlePauseTimer,
  handleResetTimer,
  handleSkipTimer,
  compact = false
}) => {
  // Determine button color based on timer state
  const getButtonColor = () => {
    if (timerState === 'work') {
      return 'bg-primary hover:bg-primary/90 shadow-md shadow-primary/20';
    } else if (timerState === 'short_break') {
      return 'bg-green-500 hover:bg-green-500/90 shadow-md shadow-green-500/20';
    } else if (timerState === 'long_break') {
      return 'bg-blue-500 hover:bg-blue-500/90 shadow-md shadow-blue-500/20';
    }
    return 'bg-primary hover:bg-primary/90 shadow-md shadow-primary/20';
  };

  if (compact) {
    return (
      <div className="flex space-x-3 items-center justify-center">
        {timerState === 'idle' || timerState === 'paused' ? (
          <Button 
            size="sm"
            className={cn(
              `${getButtonColor()}`,
              "rounded-full w-9 h-9 p-0 transition-transform hover:scale-105 active:scale-95"
            )}
            onClick={handleStartTimer}
            aria-label="Start Timer"
          >
            <Play size={16} className="text-white ml-0.5" />
          </Button>
        ) : (
          <Button 
            size="sm"
            className={cn(
              `${getButtonColor()}`,
              "rounded-full w-9 h-9 p-0 transition-transform hover:scale-105 active:scale-95"
            )}
            onClick={handlePauseTimer}
            aria-label="Pause Timer"
          >
            <Pause size={16} className="text-white" />
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-full w-7 h-7 p-0 border-muted-foreground/20 hover:bg-muted transition-transform hover:scale-105 active:scale-95"
          onClick={handleSkipTimer}
          aria-label="Skip Timer"
        >
          <SkipForward size={14} className="text-muted-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex space-x-5 items-center justify-center">
      {timerState === 'idle' || timerState === 'paused' ? (
        <Button 
          size="lg"
          className={cn(
            `${getButtonColor()}`,
            "rounded-full w-16 h-16 p-0 transition-transform hover:scale-105 active:scale-95"
          )}
          onClick={handleStartTimer}
          aria-label="Start Timer"
        >
          <Play className="text-white h-6 w-6 ml-1" />
        </Button>
      ) : (
        <Button 
          size="lg"
          className={cn(
            `${getButtonColor()}`,
            "rounded-full w-16 h-16 p-0 transition-transform hover:scale-105 active:scale-95"
          )}
          onClick={handlePauseTimer}
          aria-label="Pause Timer"
        >
          <Pause className="text-white h-6 w-6" />
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="icon"
        className="rounded-full border-muted-foreground/20 hover:bg-muted transition-transform hover:scale-105 active:scale-95"
        onClick={handleResetTimer}
        aria-label="Reset Timer"
      >
        <RefreshCcw size={16} className="text-muted-foreground" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        className="rounded-full border-muted-foreground/20 hover:bg-muted transition-transform hover:scale-105 active:scale-95"
        onClick={handleSkipTimer}
        aria-label="Skip Timer"
      >
        <SkipForward size={16} className="text-muted-foreground" />
      </Button>
    </div>
  );
};

export default TimerControls;
