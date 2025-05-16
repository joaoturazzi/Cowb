
import { supabase } from '../../integrations/supabase/client';
import { PomodoroSession, DailyProductivity, ProductivityTrend } from './analyticsTypes';
import { formatISO, subDays, parseISO, format, startOfDay, endOfDay } from 'date-fns';

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
      session_type: data.session_type as 'work' | 'short_break' | 'long_break'
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
      session_type: data.session_type as 'work' | 'short_break' | 'long_break'
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
      session_type: data.session_type as 'work' | 'short_break' | 'long_break'
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
    const startDateStr = startOfDay(startDate).toISOString();
    const endDateStr = endOfDay(endDate).toISOString();
    
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
      session_type: session.session_type as 'work' | 'short_break' | 'long_break'
    }));
  } catch (error) {
    console.error('Erro ao buscar sessões:', error);
    throw error;
  }
};

/**
 * Calcular produtividade diária no período
 */
export const getDailyProductivity = async (
  userId: string,
  days: number = 7
): Promise<DailyProductivity[]> => {
  try {
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    
    // Buscar sessões Pomodoro no período
    const sessions = await getSessionsByDateRange(userId, startDate, endDate);
    
    // Buscar tarefas completadas no período
    const startDateStr = startOfDay(startDate).toISOString().split('T')[0];
    const endDateStr = endOfDay(endDate).toISOString().split('T')[0];
    
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('target_date', startDateStr)
      .lte('target_date', endDateStr);
    
    if (tasksError) throw tasksError;
    
    // Processar dados por dia
    const productivityMap: Record<string, DailyProductivity> = {};
    
    // Inicializar dias
    for (let i = 0; i < days; i++) {
      const date = subDays(endDate, i);
      const dateKey = format(date, 'yyyy-MM-dd');
      productivityMap[dateKey] = {
        date: dateKey,
        totalFocusTime: 0,
        completedTasks: 0,
        totalSessions: 0
      };
    }
    
    // Calcular tempo focado
    sessions.forEach(session => {
      if (session.session_type === 'work' && session.status === 'completed') {
        const sessionDate = format(parseISO(session.start_time), 'yyyy-MM-dd');
        
        if (productivityMap[sessionDate]) {
          productivityMap[sessionDate].totalFocusTime += (session.actual_duration || 0);
          productivityMap[sessionDate].totalSessions += 1;
        }
      }
    });
    
    // Calcular tarefas concluídas
    (tasks || []).forEach(task => {
      const taskDate = task.target_date;
      
      if (productivityMap[taskDate]) {
        productivityMap[taskDate].completedTasks += 1;
      }
    });
    
    // Converter mapa em array
    return Object.values(productivityMap).sort((a, b) => a.date.localeCompare(b.date));
    
  } catch (error) {
    console.error('Erro ao calcular produtividade diária:', error);
    throw error;
  }
};

/**
 * Obter tendências de produtividade (semanal/mensal)
 */
export const getProductivityTrends = async (
  userId: string,
  period: 'weekly' | 'monthly' = 'weekly',
  count: number = 8
): Promise<ProductivityTrend[]> => {
  try {
    // Implementar cálculo de tendências
    // Esta é uma implementação básica que pode ser expandida
    const trends: ProductivityTrend[] = [];
    const now = new Date();
    
    if (period === 'weekly') {
      // Semanas numeradas no ano
      for (let i = count - 1; i >= 0; i--) {
        const weekStart = subDays(now, i * 7 + 6);
        const weekNumber = format(weekStart, 'w');
        const year = format(weekStart, 'yyyy');
        
        trends.push({
          period: `Semana ${weekNumber}/${year}`,
          focusTime: Math.random() * 1500, // Placeholder - substituir por dados reais
          completedTasks: Math.floor(Math.random() * 20) // Placeholder - substituir por dados reais
        });
      }
    } else {
      // Meses do ano
      for (let i = count - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        
        trends.push({
          period: format(date, 'MMM/yyyy'),
          focusTime: Math.random() * 6000, // Placeholder - substituir por dados reais
          completedTasks: Math.floor(Math.random() * 80) // Placeholder - substituir por dados reais
        });
      }
    }
    
    return trends;
  } catch (error) {
    console.error('Erro ao obter tendências de produtividade:', error);
    throw error;
  }
};

/**
 * Obter dados para estimativa de tempo com base no histórico
 */
export const getTaskTimeEstimations = async (
  userId: string,
  taskName: string
): Promise<number | null> => {
  try {
    // Buscar tarefas similares por nome (simplificação)
    const searchTerm = `%${taskName.toLowerCase()}%`;
    
    const { data: similarTasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .ilike('name', searchTerm)
      .eq('completed', true)
      .limit(10);
    
    if (error) throw error;
    
    if (!similarTasks || similarTasks.length === 0) return null;
    
    // Calcular média do tempo estimado
    const totalTime = similarTasks.reduce((sum, task) => sum + task.estimated_time, 0);
    const averageTime = Math.round(totalTime / similarTasks.length);
    
    return averageTime;
  } catch (error) {
    console.error('Erro ao estimar tempo da tarefa:', error);
    throw error;
  }
};
