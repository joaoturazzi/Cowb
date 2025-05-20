
import React from 'react';
import TimerPresets from './timer/TimerPresets';
import TimerDisplay from './timer/TimerDisplay';
import TimerControls from './timer/TimerControls';
import TimerCompletion from './timer/TimerCompletion';
import { useTimerLogic } from './timer/useTimerLogic';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const PomodoroTimer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    currentTask,
    timerSettings,
    timerState,
    timeRemaining,
    completedPomodoros,
    formatTime,
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer,
    handleSkipTimer,
    handleChangeTimerSettings,
    getTimerModeLabel,
    getProgressPercent,
    clearCurrentTask,
  } = useTimerLogic();

  const timerModeLabel = getTimerModeLabel();
  const progressPercent = getProgressPercent();
  
  // Get background color based on timer state
  const getBackgroundClass = () => {
    if (timerState === 'work') {
      return 'bg-gradient-to-r from-primary/10 to-primary/5';
    } else if (timerState === 'short_break') {
      return 'bg-gradient-to-r from-green-500/10 to-green-500/5';
    } else if (timerState === 'long_break') {
      return 'bg-gradient-to-r from-blue-500/10 to-blue-500/5';
    }
    return 'bg-muted/30';
  };

  const getTimerColor = () => {
    if (timerState === 'work') {
      return 'primary';
    } else if (timerState === 'short_break') {
      return 'green-500';
    } else if (timerState === 'long_break') {
      return 'blue-500';
    }
    return 'primary';
  };

  const timerColor = getTimerColor();

  // If compact mode, just show timer display and controls
  if (compact) {
    return (
      <motion.div 
        className={cn(
          "rounded-lg px-4 py-3 transition-colors duration-500",
          getBackgroundClass()
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-20 blur-xl pointer-events-none"
              style={{ background: `hsl(var(--${timerColor}))` }}></div>
              
          <div className="flex flex-col items-center z-10 relative">
            <TimerDisplay
              timeRemaining={timeRemaining}
              timerModeLabel={timerModeLabel}
              progressPercent={progressPercent}
              completedPomodoros={completedPomodoros}
              pomodorosUntilLongBreak={timerSettings.cyclesBeforeLongBreak}
              currentTask={currentTask}
              formatTime={formatTime}
              onClearTask={clearCurrentTask}
            />
            
            <div className="mt-2">
              <TimerControls
                timerState={timerState}
                handleStartTimer={handleStartTimer}
                handlePauseTimer={handlePauseTimer}
                handleResetTimer={handleResetTimer}
                handleSkipTimer={handleSkipTimer}
                compact
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="mb-4 overflow-hidden">
      <motion.div 
        className={cn(
          "px-4 py-6 rounded-xl transition-colors duration-500 relative",
          getBackgroundClass()
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative circle */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none"
             style={{ background: `hsl(var(--${timerColor}))` }}></div>
             
        <div className="relative z-10">
          <TimerCompletion />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <TimerPresets handleChangeTimerSettings={handleChangeTimerSettings} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center my-4"
          >
            <TimerDisplay
              timeRemaining={timeRemaining}
              timerModeLabel={timerModeLabel}
              progressPercent={progressPercent}
              completedPomodoros={completedPomodoros}
              pomodorosUntilLongBreak={timerSettings.cyclesBeforeLongBreak}
              currentTask={currentTask}
              formatTime={formatTime}
              onClearTask={clearCurrentTask}
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <TimerControls
              timerState={timerState}
              handleStartTimer={handleStartTimer}
              handlePauseTimer={handlePauseTimer}
              handleResetTimer={handleResetTimer}
              handleSkipTimer={handleSkipTimer}
            />
          </motion.div>
        </div>
      </motion.div>
    </Card>
  );
};

export default PomodoroTimer;
