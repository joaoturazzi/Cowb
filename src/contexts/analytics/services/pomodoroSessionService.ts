import { supabase } from '../../../integrations/supabase/client';
import { PomodoroSession } from '../analyticsTypes';
import { startOfDay as getStartOfDay, endOfDay as getEndOfDay } from 'date-fns';

/**
 * Registrar início de sessão Pomodoro
 */
export const startPomodoroSession = async (
  userId: string,
  sessionType: 'work' | 'short_break' | 'long_break',
  taskId: string | null,
  plannedDuration: number
): Promise<PomodoroSession> => {
  try {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .insert({
        user_id: userId,
        session_type: sessionType,
        task_id: taskId,
        planned_duration: plannedDuration,
        status: 'in_progress'
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      session_type: data.session_type as 'work' | 'short_break' | 'long_break',
      status: data.status as 'completed' | 'interrupted' | 'in_progress'
    };
  } catch (error) {
    console.error('Erro ao iniciar sessão Pomodoro:', error);
    throw error;
  }
};

/**
 * Finalizar sessão Pomodoro
 */
export const completePomodoroSession = async (
  sessionId: string,
  actualDuration: number
): Promise<PomodoroSession> => {
  try {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .update({
        end_time: new Date().toISOString(),
        actual_duration: actualDuration,
        status: 'completed'
      })
      .eq('id', sessionId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      session_type: data.session_type as 'work' | 'short_break' | 'long_break',
      status: data.status as 'completed' | 'interrupted' | 'in_progress'
    };
  } catch (error) {
    console.error('Erro ao finalizar sessão Pomodoro:', error);
    throw error;
  }
};

/**
 * Interromper sessão Pomodoro
 */
export const interruptPomodoroSession = async (
  sessionId: string,
  actualDuration: number
): Promise<PomodoroSession> => {
  try {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .update({
        end_time: new Date().toISOString(),
        actual_duration: actualDuration,
        status: 'interrupted'
      })
      .eq('id', sessionId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      session_type: data.session_type as 'work' | 'short_break' | 'long_break',
      status: data.status as 'completed' | 'interrupted' | 'in_progress'
    };
  } catch (error) {
    console.error('Erro ao interromper sessão Pomodoro:', error);
    throw error;
  }
};

/**
 * Obter sessões de um período
 */
export const getSessionsByDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<PomodoroSession[]> => {
  try {
    const startDateStr = getStartOfDay(startDate).toISOString();
    const endDateStr = getEndOfDay(endDate).toISOString();
    
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDateStr)
      .lte('start_time', endDateStr)
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(session => ({
      ...session,
      session_type: session.session_type as 'work' | 'short_break' | 'long_break',
      status: session.status as 'completed' | 'interrupted' | 'in_progress'
    }));
  } catch (error) {
    console.error('Erro ao buscar sessões:', error);
    throw error;
  }
};
