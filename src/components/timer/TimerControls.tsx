
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
  const isActive = !isIdle && !isPaused;
  
  return (
    <div className="flex justify-center gap-4 mt-6">
      {(isIdle || isPaused) ? (
        <Button 
          onClick={handleStartTimer}
          size="icon"
          variant="default"
          className="btn-timer bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
        >
          <Play className="h-6 w-6" />
        </Button>
      ) : (
        <Button 
          onClick={handlePauseTimer}
          size="icon"
          variant="default"
          className="btn-timer bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-lg transition-all"
        >
          <Pause className="h-6 w-6" />
        </Button>
      )}
      
      {timerState !== 'idle' && (
        <>
          <Button 
            onClick={handleResetTimer}
            size="icon"
            variant="outline"
            className="btn-timer border-primary/20 hover:border-primary/50 transition-all"
          >
            <ArrowRight className="h-5 w-5 text-primary" />
          </Button>
          
          <Button 
            onClick={handleSkipTimer}
            size="icon"
            variant="outline"
            className="btn-timer border-primary/20 hover:border-primary/50 transition-all"
            title={timerState === 'work' ? 'Pular para pausa' : 'Pular para foco'}
          >
            <SkipForward className="h-5 w-5 text-primary" />
          </Button>
        </>
      )}
    </div>
  );
};

export default TimerControls;
