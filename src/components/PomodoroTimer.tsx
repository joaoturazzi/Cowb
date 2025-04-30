
import React from 'react';
import TimerPresets from './timer/TimerPresets';
import TimerDisplay from './timer/TimerDisplay';
import TimerControls from './timer/TimerControls';
import { useTimerLogic } from './timer/useTimerLogic';

const PomodoroTimer: React.FC = () => {
  const {
    currentTask,
    clearCurrentTask,
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
    getProgressPercent
  } = useTimerLogic();

  const timerModeLabel = getTimerModeLabel();
  const progressPercent = getProgressPercent();

  return (
    <div className="mb-8">
      <TimerPresets handleChangeTimerSettings={handleChangeTimerSettings} />

      <TimerDisplay
        timeRemaining={timeRemaining}
        timerModeLabel={timerModeLabel}
        progressPercent={progressPercent}
        completedPomodoros={completedPomodoros}
        pomodorosUntilLongBreak={timerSettings.pomodorosUntilLongBreak}
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
