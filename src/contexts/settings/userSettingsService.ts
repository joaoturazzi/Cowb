
import { supabase } from '../../integrations/supabase/client';
import { UserSettings, TimerPreset, AudioSettings, ReminderSettings } from '../timer/timerSettingsTypes';

/**
 * Obter configurações do usuário
 */
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar configurações do usuário:', error);
    return null;
  }
};

/**
 * Criar ou atualizar configurações do usuário
 */
export const saveUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<UserSettings> => {
  try {
    // Verificar se já existem configurações
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existingSettings) {
      // Atualizar configurações existentes
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
      
      return data;
    } else {
      // Criar novas configurações
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: userId,
          ...settings
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data;
    }
  } catch (error) {
    console.error('Erro ao salvar configurações do usuário:', error);
    throw error;
  }
};

/**
 * Salvar preset de temporizador personalizado
 */
export const saveTimerPreset = async (userId: string, preset: TimerPreset): Promise<UserSettings> => {
  try {
    const { data: currentSettings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    const presets = currentSettings?.timer_presets?.custom || [];
    
    // Verificar se o preset já existe e atualizar
    const existingIndex = presets.findIndex((p: TimerPreset) => p.id === preset.id);
    
    if (existingIndex >= 0) {
      presets[existingIndex] = preset;
    } else {
      presets.push(preset);
    }
    
    // Salvar configurações atualizadas
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        timer_presets: { custom: presets },
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao salvar preset do temporizador:', error);
    throw error;
  }
};

/**
 * Atualizar configurações de áudio
 */
export const updateAudioSettings = async (userId: string, audioSettings: AudioSettings): Promise<UserSettings> => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        audio_settings: audioSettings,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao atualizar configurações de áudio:', error);
    throw error;
  }
};

/**
 * Atualizar configurações de lembretes
 */
export const updateReminderSettings = async (userId: string, reminderSettings: ReminderSettings): Promise<UserSettings> => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        reminder_settings: reminderSettings,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao atualizar configurações de lembretes:', error);
    throw error;
  }
};
