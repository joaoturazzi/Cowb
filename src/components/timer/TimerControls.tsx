
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, ArrowRight, SkipForward } from 'lucide-react';
import { TimerState } from '@/contexts';

interface TimerControlsProps {
  timerState: TimerState;
  handleStartTimer: () => void;
  handlePauseTimer: () => void;
  handleResetTimer: () => void;
  handleSkipTimer: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  timerState,
  handleStartTimer,
  handlePauseTimer,
  handleResetTimer,
  handleSkipTimer,
}) => {
  const isPaused = timerState === 'paused';
  const isIdle = timerState === 'idle';
  
  return (
    <div className="flex justify-center gap-4 mt-4">
      {(isIdle || isPaused) ? (
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
  );
};

export default TimerControls;
