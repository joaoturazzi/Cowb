
import React, { createContext, useContext, useEffect } from 'react';
import { useTimerProvider } from './timer/useTimerProvider';
import { createTimerHandlers } from './timer/timerHandlers';
import { useTimerEffects } from './timer/timerEffects';
import { TimerContextType, TimerState } from './timer/timerTypes';
import { useTasks } from './task/TaskContext';

// Create a default context value
const defaultContext: TimerContextType = {
  timerState: 'idle',
  setTimerState: () => {},
  timeLeft: 0,
  setTimeLeft: () => {},
  timeRemaining: 0,
  setTimeRemaining: () => {},
  isActive: false,
  setIsActive: () => {},
  cycle: 1,
  setCycle: () => {},
  handleStartTimer: () => {},
  handlePauseTimer: () => {},
  handleResetTimer: () => {},
  handleSkipTimer: () => {},
  completedCycles: 0,
  completedPomodoros: 0,
  incrementCompletedPomodoros: () => {},
  resetCompletedPomodoros: () => {},
  totalCycles: 0,
  settings: {
    workDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    cyclesBeforeLongBreak: 4
  },
  timerSettings: {
    workDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    cyclesBeforeLongBreak: 4
  },
  updateTimerSettings: () => {},
  setSettings: () => {},
  savedPresets: [],
  setSavedPresets: () => {},
  selectedPreset: 'default',
  setSelectedPreset: () => {},
  audioSettings: {
    enabled: false,
    volume: 50,
    source: 'lofi',
    autoStop: true
  },
  setAudioSettings: () => {}
};

const TimerContext = createContext<TimerContextType>(defaultContext);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get the base timer state and functions
  const timerState = useTimerProvider();
  
  // Now we can safely connect to TaskContext since it's a parent provider
  const taskContext = useTasks();
  
  // Extract needed props for handlers
  const {
    timerState: state,
    setTimerState,
    isActive,
    setIsActive,
    cycle,
    setCycle,
    completedCycles,
    setCompletedCycles,
    settings,
    setTimeLeft,
    currentSession,
    setCurrentSession,
    sessionStartTime,
    setSessionStartTime,
    user
  } = timerState;
  
  // Create handlers with updated currentTask from TaskContext
  const {
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer,
    handleSkipTimer
  } = createTimerHandlers({
    timerState: state,
    setTimerState,
    isActive,
    setIsActive,
    cycle,
    setCycle,
    completedCycles,
    setCompletedCycles,
    settings,
    setTimeLeft,
    currentSession,
    setCurrentSession,
    sessionStartTime,
    setSessionStartTime,
    user,
    currentTask: taskContext?.currentTask || null,
    updateFocusedTime: taskContext?.updateFocusedTime || (() => {})
  });
  
  // Use timer effects with updated context connections
  useTimerEffects({
    isActive,
    timeLeft: timerState.timeLeft,
    timerState: state,
    setTimeLeft,
    cycle,
    setCycle,
    settings,
    currentTask: taskContext?.currentTask || null,
    user,
    completedCycles,
    setCompletedCycles,
    currentSession, 
    setCurrentSession,
    sessionStartTime,
    setSessionStartTime,
    setTimerState,
    updateFocusedTime: taskContext?.updateFocusedTime || (() => {})
  });
  
  // Combine everything for the context value
  const value: TimerContextType = {
    timerState: state,
    setTimerState,
    timeLeft: timerState.timeLeft,
    setTimeLeft,
    timeRemaining: timerState.timeRemaining,
    setTimeRemaining: timerState.setTimeRemaining,
    isActive,
    setIsActive,
    cycle,
    setCycle,
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer,
    handleSkipTimer,
    completedCycles,
    completedPomodoros: timerState.completedPomodoros,
    incrementCompletedPomodoros: timerState.incrementCompletedPomodoros,
    resetCompletedPomodoros: timerState.resetCompletedPomodoros,
    totalCycles: timerState.totalCycles,
    settings,
    timerSettings: timerState.timerSettings,
    updateTimerSettings: timerState.updateTimerSettings,
    setSettings: timerState.setSettings,
    savedPresets: timerState.savedPresets,
    setSavedPresets: timerState.setSavedPresets,
    selectedPreset: timerState.selectedPreset,
    setSelectedPreset: timerState.setSelectedPreset,
    audioSettings: timerState.audioSettings,
    setAudioSettings: timerState.setAudioSettings
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export type { TimerState };
export type { TimerSettings } from './timer/timerTypes';
