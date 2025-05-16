
export interface TimerPreset {
  id: string;
  name: string;
  workDuration: number; // em minutos
  shortBreakDuration: number; // em minutos
  longBreakDuration: number; // em minutos
  cyclesBeforeLongBreak: number;
  isDefault?: boolean;
}

export interface AudioSettings {
  enabled: boolean;
  volume: number; // 0-100
  source: 'lofi' | 'white-noise' | 'nature' | 'none';
  autoStop: boolean;
}

export interface ReminderSettings {
  water: boolean;
  stretch: boolean;
  eyes: boolean;
  frequency: number; // em minutos
}

export interface UserSettings {
  timer_presets: {
    custom: TimerPreset[];
  };
  reminder_settings: ReminderSettings;
  audio_settings: AudioSettings;
  theme_preference: string;
}
