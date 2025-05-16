
import { AudioSettings, TimerPreset } from './timerSettingsTypes';
import { PomodoroSession } from '../analytics/analyticsTypes';

export type TimerState = 'idle' | 'work' | 'short_break' | 'long_break' | 'paused';

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
}

export interface TimerContextType {
  timerState: TimerState;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  timeRemaining: number;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  cycle: number;
  setCycle: React.Dispatch<React.SetStateAction<number>>;
  handleStartTimer: () => void;
  handlePauseTimer: () => void;
  handleResetTimer: () => void;
  handleSkipTimer: () => void;
  completedCycles: number;
  completedPomodoros: number;
  incrementCompletedPomodoros: () => void;
  resetCompletedPomodoros: () => void;
  totalCycles: number;
  settings: TimerSettings;
  timerSettings: TimerSettings;
  updateTimerSettings: (settings: TimerSettings) => void;
  setSettings: React.Dispatch<React.SetStateAction<TimerSettings>>;
  savedPresets: TimerPreset[];
  setSavedPresets: React.Dispatch<React.SetStateAction<TimerPreset[]>>;
  selectedPreset: string;
  setSelectedPreset: React.Dispatch<React.SetStateAction<string>>;
  audioSettings: AudioSettings;
  setAudioSettings: React.Dispatch<React.SetStateAction<AudioSettings>>;
}
