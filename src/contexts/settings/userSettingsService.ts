
import { supabase } from '../../integrations/supabase/client';
import { AudioSettings, ReminderSettings, TimerPreset, UserSettings } from '../timer/timerSettingsTypes';

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
    
    // Transformar o JSON em objetos tipados
    return {
      timer_presets: typeof data.timer_presets === 'object' 
        ? data.timer_presets as { custom: TimerPreset[] }
        : { custom: [] },
      reminder_settings: typeof data.reminder_settings === 'object'
        ? data.reminder_settings as ReminderSettings
        : { water: true, stretch: true, eyes: true, frequency: 30 },
      audio_settings: typeof data.audio_settings === 'object'
        ? data.audio_settings as AudioSettings
        : { enabled: false, volume: 50, source: 'lofi', autoStop: true },
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
    
    // Se não existir, criar um novo registro
    if (!existing) {
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: userId,
          timer_presets: settings.timer_presets || { custom: [] },
          reminder_settings: settings.reminder_settings || { water: true, stretch: true, eyes: true, frequency: 30 },
          audio_settings: settings.audio_settings || { enabled: false, volume: 50, source: 'lofi', autoStop: true },
          theme_preference: settings.theme_preference || 'system'
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Transformar o JSON em objetos tipados
      return {
        timer_presets: typeof data.timer_presets === 'object' 
          ? data.timer_presets as { custom: TimerPreset[] }
          : { custom: [] },
        reminder_settings: typeof data.reminder_settings === 'object'
          ? data.reminder_settings as ReminderSettings
          : { water: true, stretch: true, eyes: true, frequency: 30 },
        audio_settings: typeof data.audio_settings === 'object'
          ? data.audio_settings as AudioSettings
          : { enabled: false, volume: 50, source: 'lofi', autoStop: true },
        theme_preference: data.theme_preference
      };
    }
    
    // Se existir, atualizar
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    // Transformar o JSON em objetos tipados
    return {
      timer_presets: typeof data.timer_presets === 'object' 
        ? data.timer_presets as { custom: TimerPreset[] }
        : { custom: [] },
      reminder_settings: typeof data.reminder_settings === 'object'
        ? data.reminder_settings as ReminderSettings
        : { water: true, stretch: true, eyes: true, frequency: 30 },
      audio_settings: typeof data.audio_settings === 'object'
        ? data.audio_settings as AudioSettings
        : { enabled: false, volume: 50, source: 'lofi', autoStop: true },
      theme_preference: data.theme_preference
    };
  } catch (error) {
    console.error('Erro ao atualizar configurações do usuário:', error);
    return null;
  }
};
