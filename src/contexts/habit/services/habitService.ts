
import { supabase } from '@/integrations/supabase/client';
import { Habit, HabitLog } from '../habitTypes';
import { formatDate } from '@/utils/dateUtils';
import { toast } from 'sonner';

/**
 * Creates a new habit
 */
export const createHabit = async (
  habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'active'>,
  userId: string
): Promise<Habit | null> => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .insert({
        ...habit,
        user_id: userId,
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Type cast frequency_type to match our union type
    const typedHabit = {
      ...data,
      frequency_type: data.frequency_type as 'daily' | 'weekly' | 'specific_days'
    };
    
    return typedHabit;
  } catch (err) {
    console.error('Error creating habit:', err);
    return null;
  }
};

/**
 * Updates an existing habit
 */
export const updateHabit = async (
  id: string,
  updates: Partial<Habit>,
  userId: string
): Promise<Habit | null> => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) throw error;
    
    // Type cast frequency_type to match our union type
    const typedHabit = {
      ...data,
      frequency_type: data.frequency_type as 'daily' | 'weekly' | 'specific_days'
    };
    
    return typedHabit;
  } catch (err) {
    console.error('Error updating habit:', err);
    return null;
  }
};

/**
 * Soft deletes a habit by setting its active status to false
 */
export const deleteHabit = async (id: string, userId: string): Promise<boolean> => {
  try {
    // Instead of hard deleting, we set active to false
    const { error } = await supabase
      .from('habits')
      .update({ active: false })
      .eq('id', id)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error('Error deleting habit:', err);
    return false;
  }
};

/**
 * Toggles the completion status of a habit for a specific date
 */
export const toggleHabitCompletion = async (
  habitId: string,
  userId: string,
  date: Date = new Date(),
  completed?: boolean
): Promise<boolean> => {
  try {
    const dateStr = formatDate(date, 'yyyy-MM-dd');
    
    // Check if a log already exists for this date and habit
    const { data: existingLog, error: checkError } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('habit_id', habitId)
      .eq('date', dateStr)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    // If completed is not provided, toggle the current state
    const newCompletedState = completed !== undefined
      ? completed
      : existingLog ? !existingLog.completed : true;
    
    if (existingLog) {
      // Update existing log
      const { error } = await supabase
        .from('habit_logs')
        .update({ completed: newCompletedState })
        .eq('id', existingLog.id);
        
      if (error) throw error;
    } else {
      // Create new log
      const { error } = await supabase
        .from('habit_logs')
        .insert({
          habit_id: habitId,
          user_id: userId,
          date: dateStr,
          completed: newCompletedState
        });
        
      if (error) throw error;
    }
    
    // Show feedback
    if (newCompletedState) {
      toast.success("Hábito marcado como concluído", {
        description: "Continue assim para manter seu streak!"
      });
    }
    
    return true;
  } catch (err) {
    console.error('Error toggling habit completion:', err);
    toast.error("Não foi possível atualizar o hábito", {
      description: "Por favor, tente novamente."
    });
    return false;
  }
};

/**
 * Fetches habits and their logs for a specific user
 */
export const fetchUserHabits = async (userId: string, daysOfLogs: number = 60) => {
  try {
    // Fetch habits
    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('created_at', { ascending: false });
      
    if (habitsError) throw habitsError;
    
    if (!habitsData || habitsData.length === 0) {
      return [];
    }
    
    // Fetch logs for the specified period
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - daysOfLogs);
    
    const { data: logsData, error: logsError } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('date', formatDate(daysAgo, 'yyyy-MM-dd'))
      .in('habit_id', habitsData.map(h => h.id));
      
    if (logsError) throw logsError;
    
    return { habits: habitsData, logs: logsData || [] };
  } catch (err) {
    console.error('Error fetching habits:', err);
    throw err;
  }
};
