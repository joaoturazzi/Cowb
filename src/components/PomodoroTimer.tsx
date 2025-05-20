import React from 'react';
import TimerPresets from './timer/TimerPresets';
import TimerDisplay from './timer/TimerDisplay';
import TimerControls from './timer/TimerControls';
import TimerCompletion from './timer/TimerCompletion';
import { useTimerLogic } from './timer/useTimerLogic';

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

  return (
    <div className="max-w-md mx-auto px-4">
      <TimerCompletion />
      <TimerPresets handleChangeTimerSettings={handleChangeTimerSettings} />

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
  );
};

export default PomodoroTimer;
