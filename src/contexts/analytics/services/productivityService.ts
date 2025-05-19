
import { supabase } from '../../../integrations/supabase/client';
import { DailyProductivity, ProductivityTrend } from '../analyticsTypes';
import { format, subDays, parseISO } from '@/utils/dateUtils';
import { getSessionsByDateRange } from './pomodoroSessionService';

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
