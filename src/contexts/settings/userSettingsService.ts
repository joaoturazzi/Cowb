
import { supabase } from '../../integrations/supabase/client';
import { AudioSettings, ReminderSettings, TimerPreset, UserSettings } from '../timer/timerSettingsTypes';
import { Json } from '@/integrations/supabase/types';

/**
 * Helper function to safely convert JSON to typed objects
 */
const safeJsonParse = <T>(json: Json | null, defaultValue: T): T => {
  if (!json) return defaultValue;
  
  try {
    if (typeof json === 'string') {
      return JSON.parse(json) as T;
    }
    if (typeof json === 'object') {
      // Type assertion as unknown first, then as T
      return json as unknown as T;
    }
  } catch (e) {
    console.error('Error parsing JSON:', e);
  }
  
  return defaultValue;
};

/**
 * Busca as configurações do usuário
 */
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // Se o erro for que o registro não existe, retornar null
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    // Transformar o JSON em objetos tipados com verificações de segurança
    const defaultTimerPresets = { custom: [] };
    const defaultReminderSettings = { water: true, stretch: true, eyes: true, frequency: 30 };
    const defaultAudioSettings = { enabled: false, volume: 50, source: 'lofi' as const, autoStop: true };
    
    return {
      timer_presets: safeJsonParse(data.timer_presets, defaultTimerPresets),
      reminder_settings: safeJsonParse(data.reminder_settings, defaultReminderSettings),
      audio_settings: safeJsonParse(data.audio_settings, defaultAudioSettings),
      theme_preference: data.theme_preference
    };
  } catch (error) {
    console.error('Erro ao buscar configurações do usuário:', error);
    return null;
  }
};

/**
 * Atualiza as configurações do usuário
 */
export const updateUserSettings = async (
  userId: string, 
  settings: {
    timer_presets?: { custom: TimerPreset[] };
    reminder_settings?: ReminderSettings;
    audio_settings?: AudioSettings;
    theme_preference?: string;
  }
): Promise<UserSettings | null> => {
  try {
    const { data: existing } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    // Preparar os dados para inserção/atualização, convertendo tipos complexos para JSON
    const dataToSave = {
      ...(settings.timer_presets && { timer_presets: settings.timer_presets as unknown as Json }),
      ...(settings.reminder_settings && { reminder_settings: settings.reminder_settings as unknown as Json }),
      ...(settings.audio_settings && { audio_settings: settings.audio_settings as unknown as Json }),
      ...(settings.theme_preference && { theme_preference: settings.theme_preference }),
      updated_at: new Date().toISOString()
    };
    
    // Se não existir, criar um novo registro
    if (!existing) {
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: userId,
          ...dataToSave
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Default values
      const defaultTimerPresets = { custom: [] };
      const defaultReminderSettings = { water: true, stretch: true, eyes: true, frequency: 30 };
      const defaultAudioSettings = { enabled: false, volume: 50, source: 'lofi' as const, autoStop: true };
      
      return {
        timer_presets: safeJsonParse(data.timer_presets, defaultTimerPresets),
        reminder_settings: safeJsonParse(data.reminder_settings, defaultReminderSettings),
        audio_settings: safeJsonParse(data.audio_settings, defaultAudioSettings),
        theme_preference: data.theme_preference
      };
    }
    
    // Se existir, atualizar
    const { data, error } = await supabase
      .from('user_settings')
      .update(dataToSave)
      .eq('user_id', userId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    // Default values
    const defaultTimerPresets = { custom: [] };
    const defaultReminderSettings = { water: true, stretch: true, eyes: true, frequency: 30 };
    const defaultAudioSettings = { enabled: false, volume: 50, source: 'lofi' as const, autoStop: true };
    
    return {
      timer_presets: safeJsonParse(data.timer_presets, defaultTimerPresets),
      reminder_settings: safeJsonParse(data.reminder_settings, defaultReminderSettings),
      audio_settings: safeJsonParse(data.audio_settings, defaultAudioSettings),
      theme_preference: data.theme_preference
    };
  } catch (error) {
    console.error('Erro ao atualizar configurações do usuário:', error);
    return null;
  }
};

// Alias functions for backward compatibility
export const saveUserSettings = updateUserSettings;
export const updateAudioSettings = (userId: string, audioSettings: AudioSettings) => 
  updateUserSettings(userId, { audio_settings: audioSettings });
export const updateReminderSettings = (userId: string, reminderSettings: ReminderSettings) => 
  updateUserSettings(userId, { reminder_settings: reminderSettings });
