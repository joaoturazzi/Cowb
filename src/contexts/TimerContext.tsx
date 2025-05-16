
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useTask } from './task/TaskContext';
import { startPomodoroSession, completePomodoroSession, interruptPomodoroSession } from './analytics/analyticsService';
import { PomodoroSession } from './analytics/analyticsTypes';
import { getUserSettings } from './settings/userSettingsService';
import { AudioSettings, TimerPreset } from './timer/timerSettingsTypes';

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

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  
  // Aliases para compatibilidade com código existente
  const timeRemaining = timeLeft;
  const setTimeRemaining = setTimeLeft;
  const timerSettings = settings;

  // Para rastrear a sessão atual
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const incrementCompletedPomodoros = () => {
    setCompletedPomodoros(prev => prev + 1);
  };

  const resetCompletedPomodoros = () => {
    setCompletedPomodoros(0);
  };

  const updateTimerSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
  };

  useEffect(() => {
    // Carregar configurações do usuário
    if (isAuthenticated && user) {
      getUserSettings(user.id).then(settings => {
        if (settings) {
          const userPresets = settings.timer_presets?.custom || [];
          setSavedPresets(userPresets);
          
          // Configurar áudio
          if (settings.audio_settings) {
            setAudioSettings(settings.audio_settings);
          }
        }
      }).catch(error => {
        console.error('Erro ao carregar configurações do usuário:', error);
      });
    }
  }, [isAuthenticated, user]);

  // Escolher a duração do temporizador com base no estado
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

  // Controle do timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Quando o temporizador chega a zero
      
      // Se estávamos em um período de trabalho, registrar o tempo concluído
      if (timerState === 'work') {
        // Atualizar estatísticas
        updateFocusedTime(settings.workDuration);
        setCompletedCycles(completedCycles + 1);
        
        // Registrar conclusão da sessão
        if (currentSession && user) {
          completePomodoroSession(
            currentSession.id, 
            settings.workDuration
          ).catch(console.error);
        }
        
        // Determinar o próximo estado
        if (cycle >= settings.cyclesBeforeLongBreak) {
          setTimerState('long_break');
          setCycle(1);
        } else {
          setTimerState('short_break');
          setCycle(cycle + 1);
        }
      } else {
        // Se era uma pausa, voltar ao trabalho
        setTimerState('work');
        
        // Iniciar nova sessão de trabalho
        if (user) {
          startPomodoroSession(
            user.id,
            'work',
            currentTask?.id || null,
            settings.workDuration
          ).then(session => {
            setCurrentSession(session);
            setSessionStartTime(Date.now());
          }).catch(console.error);
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerState, cycle, settings, currentTask, user, completedCycles, currentSession, updateFocusedTime]);

  // Manipuladores de eventos do temporizador
  const handleStartTimer = async () => {
    // Se estamos iniciando uma sessão de trabalho, registrar
    if (!isActive && timerState === 'work' && user) {
      try {
        const session = await startPomodoroSession(
          user.id,
          'work',
          currentTask?.id || null,
          settings.workDuration
        );
        
        setCurrentSession(session);
        setSessionStartTime(Date.now());
      } catch (error) {
        console.error('Erro ao iniciar sessão:', error);
      }
    }
    
    setIsActive(true);
  };

  const handlePauseTimer = async () => {
    setIsActive(false);
    
    // Se estamos pausando uma sessão de trabalho, registrar o tempo até agora
    if (timerState === 'work' && currentSession && sessionStartTime) {
      try {
        const actualDuration = Math.round((Date.now() - sessionStartTime) / 1000);
        
        await interruptPomodoroSession(
          currentSession.id,
          actualDuration
        );
        
        setCurrentSession(null);
        setSessionStartTime(null);
      } catch (error) {
        console.error('Erro ao interromper sessão:', error);
      }
    }
  };

  const handleResetTimer = async () => {
    setIsActive(false);
    
    // Se estamos redefinindo uma sessão de trabalho, registrar como interrompida
    if (timerState === 'work' && currentSession && sessionStartTime) {
      try {
        const actualDuration = Math.round((Date.now() - sessionStartTime) / 1000);
        
        await interruptPomodoroSession(
          currentSession.id,
          actualDuration
        );
        
        setCurrentSession(null);
        setSessionStartTime(null);
      } catch (error) {
        console.error('Erro ao interromper sessão:', error);
      }
    }
    
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
  };

  const handleSkipTimer = async () => {
    setIsActive(false);
    
    // Se estamos pulando uma sessão de trabalho, registrar como interrompida
    if (timerState === 'work' && currentSession && sessionStartTime) {
      try {
        const actualDuration = Math.round((Date.now() - sessionStartTime) / 1000);
        
        await interruptPomodoroSession(
          currentSession.id,
          actualDuration
        );
        
        setCurrentSession(null);
        setSessionStartTime(null);
      } catch (error) {
        console.error('Erro ao interromper sessão:', error);
      }
    }
    
    // Avançar para o próximo estado
    if (timerState === 'work') {
      if (cycle >= settings.cyclesBeforeLongBreak) {
        setTimerState('long_break');
        setCycle(1);
      } else {
        setTimerState('short_break');
        setCycle(cycle + 1);
      }
    } else {
      setTimerState('work');
    }
  };

  useEffect(() => {
    // Atualizar o total de ciclos para estatísticas
    setTotalCycles(Math.max(completedCycles, cycle - 1));
  }, [completedCycles, cycle]);

  return (
    <TimerContext.Provider
      value={{
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
        handleStartTimer,
        handlePauseTimer,
        handleResetTimer,
        handleSkipTimer,
        completedCycles,
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
        setAudioSettings
      }}
    >
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
