
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTask } from '../task/TaskContext';
import { 
  startPomodoroSession, 
  completePomodoroSession, 
  interruptPomodoroSession 
} from '../analytics/analyticsService';
import { PomodoroSession } from '../analytics/analyticsTypes';
import { getUserSettings } from '../userSettingsService';
import { TimerState, TimerSettings } from './timerTypes';
import { AudioSettings, TimerPreset } from './timerSettingsTypes';

const defaultSettings: TimerSettings = {
  workDuration: 25 * 60, // 25 minutes in seconds
  shortBreakDuration: 5 * 60, // 5 minutes
  longBreakDuration: 15 * 60, // 15 minutes
  cyclesBeforeLongBreak: 4,
};

const defaultAudioSettings: AudioSettings = {
  enabled: false,
  volume: 50,
  source: 'lofi',
  autoStop: true
};

export const useTimerProvider = () => {
  const { isAuthenticated, user } = useAuth();
  const { updateFocusedTime, currentTask } = useTask();
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(defaultSettings.workDuration);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [cycle, setCycle] = useState<number>(1);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const [totalCycles, setTotalCycles] = useState<number>(0);
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [savedPresets, setSavedPresets] = useState<TimerPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('default');
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(defaultAudioSettings);
  
  // For tracking the current session
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Aliases for compatibility with existing code
  const timeRemaining = timeLeft;
  const setTimeRemaining = setTimeLeft;
  const timerSettings = settings;

  const incrementCompletedPomodoros = () => {
    setCompletedPomodoros(prev => prev + 1);
  };

  const resetCompletedPomodoros = () => {
    setCompletedPomodoros(0);
  };

  const updateTimerSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
  };

  // Load user settings
  useEffect(() => {
    if (isAuthenticated && user) {
      getUserSettings(user.id).then(settings => {
        if (settings) {
          const userPresets = settings.timer_presets?.custom || [];
          setSavedPresets(userPresets);
          
          // Set audio configuration
          if (settings.audio_settings) {
            setAudioSettings(settings.audio_settings);
          }
        }
      }).catch(error => {
        console.error('Error loading user settings:', error);
      });
    }
  }, [isAuthenticated, user]);

  // Update timer duration based on state
  useEffect(() => {
    switch (timerState) {
      case 'work':
        setTimeLeft(settings.workDuration);
        break;
      case 'short_break':
        setTimeLeft(settings.shortBreakDuration);
        break;
      case 'long_break':
        setTimeLeft(settings.longBreakDuration);
        break;
      default:
        setTimeLeft(settings.workDuration);
    }
  }, [timerState, settings]);

  // Update total cycles for statistics
  useEffect(() => {
    setTotalCycles(Math.max(completedCycles, cycle - 1));
  }, [completedCycles, cycle]);

  return {
    timerState,
    setTimerState,
    timeLeft,
    setTimeLeft,
    timeRemaining,
    setTimeRemaining,
    isActive,
    setIsActive,
    cycle,
    setCycle,
    completedCycles,
    setCompletedCycles,
    completedPomodoros,
    incrementCompletedPomodoros,
    resetCompletedPomodoros,
    totalCycles,
    settings,
    timerSettings,
    updateTimerSettings,
    setSettings,
    savedPresets,
    setSavedPresets,
    selectedPreset,
    setSelectedPreset,
    audioSettings,
    setAudioSettings,
    currentSession,
    setCurrentSession,
    sessionStartTime,
    setSessionStartTime,
    user,
    currentTask,
    updateFocusedTime
  };
};
