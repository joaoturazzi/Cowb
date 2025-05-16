
import { supabase } from '../../../integrations/supabase/client';

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
