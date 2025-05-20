
import React from 'react';
import TimerPresets from './timer/TimerPresets';
import TimerDisplay from './timer/TimerDisplay';
import TimerControls from './timer/TimerControls';
import TimerCompletion from './timer/TimerCompletion';
import { useTimerLogic } from './timer/useTimerLogic';
import { Card } from '@/components/ui/card';

const PomodoroTimer: React.FC = () => {
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
  
  const isInFocus = timerState === 'work' && timerState !== 'idle' && timerState !== 'paused';

  return (
    <div className={`transition-all ${isInFocus ? 'scale-105' : ''}`}>
      <TimerCompletion />
      
      <div className="flex justify-center mb-4">
        <TimerPresets handleChangeTimerSettings={handleChangeTimerSettings} />
      </div>

      <div className="max-w-md mx-auto px-4">
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

        <TimerControls
          timerState={timerState}
          handleStartTimer={handleStartTimer}
          handlePauseTimer={handlePauseTimer}
          handleResetTimer={handleResetTimer}
          handleSkipTimer={handleSkipTimer}
        />
      </div>
    </div>
  );
};

export default PomodoroTimer;
