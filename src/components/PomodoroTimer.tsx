
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
      return 'bg-primary/10';
    } else if (timerState === 'short_break') {
      return 'bg-green-500/10';
    } else if (timerState === 'long_break') {
      return 'bg-blue-500/10';
    }
    return 'bg-muted/30';
  };

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
        <div className="flex flex-col items-center">
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
      </motion.div>
    );
  }

  return (
    <Card className="mb-4 overflow-hidden">
      <motion.div 
        className={cn(
          "px-4 py-6 rounded-xl transition-colors duration-500",
          getBackgroundClass()
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>
    </Card>
  );
};

export default PomodoroTimer;
