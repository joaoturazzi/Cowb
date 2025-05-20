
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { TimerState } from '@/contexts';
import { motion } from 'framer-motion';

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
  const isRunning = !isPaused && !isIdle;
  
  // Function to determine button color based on timer state
  const getButtonColor = () => {
    if (timerState === 'work' || isIdle) {
      return 'bg-primary hover:bg-primary/90';
    } else if (timerState === 'short_break') {
      return 'bg-green-500 hover:bg-green-600';
    } else if (timerState === 'long_break') {
      return 'bg-blue-500 hover:bg-blue-600';
    }
    return 'bg-primary hover:bg-primary/90';
  };

  const mainButtonColor = getButtonColor();
  
  return (
    <div className="flex justify-center gap-4 mt-8">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {(isIdle || isPaused) ? (
          <Button 
            onClick={handleStartTimer}
            size="icon"
            variant="default"
            className={`btn-timer ${mainButtonColor} shadow-lg transition-all h-16 w-16`}
          >
            <Play className="h-7 w-7" />
          </Button>
        ) : (
          <Button 
            onClick={handlePauseTimer}
            size="icon"
            variant="default"
            className={`btn-timer ${mainButtonColor} shadow-lg transition-all h-16 w-16`}
          >
            <Pause className="h-7 w-7" />
          </Button>
        )}
      </motion.div>
      
      {timerState !== 'idle' && (
        <>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleResetTimer}
              size="icon"
              variant="outline"
              className="btn-timer shadow-sm h-12 w-12 border-2"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleSkipTimer}
              size="icon"
              variant="outline"
              className="btn-timer shadow-sm h-12 w-12 border-2"
              title={timerState === 'work' ? 'Pular para pausa' : 'Pular para foco'}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default TimerControls;
