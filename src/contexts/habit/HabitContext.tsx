import React, { createContext, useContext, useEffect, useState } from 'react';
import { Habit, HabitLog, HabitWithStats } from './habitTypes';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../AuthContext';
import { formatDate, parseISODate } from '@/utils/dateUtils';

// Context interface
interface HabitContextType {
  habits: HabitWithStats[];
  isLoading: boolean;
  error: Error | null;
  createHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'active'>) => Promise<Habit | null>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<Habit | null>;
  deleteHabit: (id: string) => Promise<boolean>;
  toggleHabitCompletion: (habitId: string, date?: Date, completed?: boolean) => Promise<boolean>;
  refreshHabits: () => Promise<void>;
}

// Create context
const HabitContext = createContext<HabitContextType | null>(null);

// Custom hook for using the habit context
export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};

// Provider component
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Calculate stats for habits
  const calculateHabitStats = (habit: Habit, logs: HabitLog[]): HabitWithStats => {
    // Sort logs by date descending
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Check if completed today
    const today = formatDate(new Date(), 'yyyy-MM-dd');
    const completedToday = sortedLogs.some(log => log.date === today && log.completed);
    
    // Calculate current streak
    let currentStreak = 0;
    const now = new Date();
    
    // Loop back through days checking for completed habits
    for (let i = 0; i < 366; i++) { // Max 1 year lookback
      const checkDate = new Date();
      checkDate.setDate(now.getDate() - i);
      
      // Skip days not in frequency_days (0=Sunday, 6=Saturday)
      const dayOfWeek = checkDate.getDay();
      if (!habit.frequency_days.includes(dayOfWeek)) {
        continue;
      }
      
      const dateStr = formatDate(checkDate, 'yyyy-MM-dd');
      const log = sortedLogs.find(l => l.date === dateStr);
      
      if (log && log.completed) {
        currentStreak++;
      } else if (i > 0) { // If we've checked at least one day and found an incomplete, break
        break;
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const logsMap = new Map<string, boolean>();
    
    // Create a map for quick lookup
    sortedLogs.forEach(log => {
      logsMap.set(log.date, log.completed);
    });
    
    // Check the last 366 days
    for (let i = 365; i >= 0; i--) {
      const checkDate = new Date();
      checkDate.setDate(now.getDate() - i);
      
      // Skip days not in frequency_days
      const dayOfWeek = checkDate.getDay();
      if (!habit.frequency_days.includes(dayOfWeek)) {
        continue;
      }
      
      const dateStr = formatDate(checkDate, 'yyyy-MM-dd');
      const completed = logsMap.get(dateStr) || false;
      
      if (completed) {
        tempStreak++;
      } else {
        // Update longest streak if current temp streak is longer
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }
    
    // Check once more after the loop in case the longest streak is the current streak
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    
    // Calculate completion rate (last 30 days)
    const last30Days = sortedLogs.filter(log => {
      const logDate = new Date(log.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return logDate >= thirtyDaysAgo;
    });
    
    let totalDaysToCheck = 0;
    
    // Count days in the last 30 days that match the frequency
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date();
      checkDate.setDate(now.getDate() - i);
      
      const dayOfWeek = checkDate.getDay();
      if (habit.frequency_days.includes(dayOfWeek)) {
        totalDaysToCheck++;
      }
    }
    
    const completedDays = last30Days.filter(log => log.completed).length;
    const completionRate = totalDaysToCheck > 0 ? (completedDays / totalDaysToCheck) * 100 : 0;
    
    return {
      ...habit,
      currentStreak,
      longestStreak,
      completionRate,
      completedToday,
      logs: sortedLogs
    };
  };

  // Fetch habits and logs
  const fetchHabits = async () => {
    if (!isAuthenticated || !user) {
      setHabits([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false });
        
      if (habitsError) throw habitsError;
      
      if (!habitsData || habitsData.length === 0) {
        setHabits([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch last 60 days of logs for all habits
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      
      const { data: logsData, error: logsError } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', formatDate(sixtyDaysAgo, 'yyyy-MM-dd'))
        .in('habit_id', habitsData.map(h => h.id));
        
      if (logsError) throw logsError;
      
      // Calculate stats for each habit - with proper type casting for frequency_type
      const habitsWithStats: HabitWithStats[] = habitsData.map(habit => {
        const typedHabit = {
          ...habit,
          frequency_type: habit.frequency_type as 'daily' | 'weekly' | 'specific_days'
        };
        const habitLogs = logsData ? logsData.filter(log => log.habit_id === habit.id) : [];
        return calculateHabitStats(typedHabit, habitLogs);
      });
      
      setHabits(habitsWithStats);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch habits'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new habit
  const createHabit = async (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'active'>): Promise<Habit | null> => {
    if (!isAuthenticated || !user) return null;
    
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          ...habit,
          user_id: user.id,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Type cast frequency_type to match our union type
      const typedHabit = {
        ...data,
        frequency_type: data.frequency_type as 'daily' | 'weekly' | 'specific_days'
      };
      
      // Refresh habits list
      fetchHabits();
      
      return typedHabit;
    } catch (err) {
      console.error('Error creating habit:', err);
      setError(err instanceof Error ? err : new Error('Failed to create habit'));
      return null;
    }
  };
  
  // Update a habit
  const updateHabit = async (id: string, updates: Partial<Habit>): Promise<Habit | null> => {
    if (!isAuthenticated || !user) return null;
    
    try {
      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Type cast frequency_type to match our union type
      const typedHabit = {
        ...data,
        frequency_type: data.frequency_type as 'daily' | 'weekly' | 'specific_days'
      };
      
      // Refresh habits list
      fetchHabits();
      
      return typedHabit;
    } catch (err) {
      console.error('Error updating habit:', err);
      setError(err instanceof Error ? err : new Error('Failed to update habit'));
      return null;
    }
  };
  
  // Delete a habit
  const deleteHabit = async (id: string): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;
    
    try {
      // Instead of hard deleting, we set active to false
      const { error } = await supabase
        .from('habits')
        .update({ active: false })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Refresh habits list
      fetchHabits();
      
      return true;
    } catch (err) {
      console.error('Error deleting habit:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete habit'));
      return false;
    }
  };
  
  // Toggle habit completion for a specific date
  const toggleHabitCompletion = async (habitId: string, date: Date = new Date(), completed?: boolean): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;
    
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
            user_id: user.id,
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
      
      // Refresh habits list to update stats
      await fetchHabits();
      
      return true;
    } catch (err) {
      console.error('Error toggling habit completion:', err);
      setError(err instanceof Error ? err : new Error('Failed to update habit completion'));
      toast.error("Não foi possível atualizar o hábito", {
        description: "Por favor, tente novamente."
      });
      return false;
    }
  };

  // Effect to load habits when the user's auth state changes
  useEffect(() => {
    fetchHabits();
  }, [isAuthenticated, user?.id]);

  return (
    <HabitContext.Provider
      value={{
        habits,
        isLoading,
        error,
        createHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        refreshHabits: fetchHabits
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};
