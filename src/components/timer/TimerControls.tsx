
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, RefreshCcw } from 'lucide-react';
import { TimerState } from '@/contexts';

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
      return 'bg-primary hover:bg-primary/90';
    } else if (timerState === 'short_break') {
      return 'bg-green-500 hover:bg-green-500/90';
    } else if (timerState === 'long_break') {
      return 'bg-blue-500 hover:bg-blue-500/90';
    }
    return 'bg-primary hover:bg-primary/90';
  };

  if (compact) {
    return (
      <div className="flex space-x-2 items-center justify-center">
        {timerState === 'idle' || timerState === 'paused' ? (
          <Button 
            size="sm"
            className={`${getButtonColor()} rounded-full w-8 h-8 p-0`}
            onClick={handleStartTimer}
            aria-label="Start Timer"
          >
            <Play size={14} className="text-white" />
          </Button>
        ) : (
          <Button 
            size="sm"
            className={`${getButtonColor()} rounded-full w-8 h-8 p-0`}
            onClick={handlePauseTimer}
            aria-label="Pause Timer"
          >
            <Pause size={14} className="text-white" />
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-full w-7 h-7 p-0"
          onClick={handleSkipTimer}
          aria-label="Skip Timer"
        >
          <SkipForward size={12} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 items-center justify-center">
      {timerState === 'idle' || timerState === 'paused' ? (
        <Button 
          size="lg"
          className={`${getButtonColor()} rounded-full w-14 h-14 p-0`}
          onClick={handleStartTimer}
          aria-label="Start Timer"
        >
          <Play className="text-white" />
        </Button>
      ) : (
        <Button 
          size="lg"
          className={`${getButtonColor()} rounded-full w-14 h-14 p-0`}
          onClick={handlePauseTimer}
          aria-label="Pause Timer"
        >
          <Pause className="text-white" />
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="icon"
        className="rounded-full"
        onClick={handleResetTimer}
        aria-label="Reset Timer"
      >
        <RefreshCcw size={16} />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        className="rounded-full"
        onClick={handleSkipTimer}
        aria-label="Skip Timer"
      >
        <SkipForward size={16} />
      </Button>
    </div>
  );
};

export default TimerControls;
