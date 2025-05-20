import { useState, useEffect } from 'react';
import { useAuth } from '../auth';
import { Habit, HabitLog, HabitWithStats } from './habitTypes';
import { calculateHabitStats } from './utils/habitStatsUtils';
import { 
  createHabit as createHabitService,
  updateHabit as updateHabitService,
  deleteHabit as deleteHabitService,
  toggleHabitCompletion as toggleHabitCompletionService,
  fetchUserHabits
} from './services/habitService';

export const useHabitProvider = () => {
  const { isAuthenticated, user } = useAuth();
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHabits = async () => {
    if (!isAuthenticated || !user) {
      setHabits([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchUserHabits(user.id);
      
      // Check if result is an array (old format) or object with habits and logs properties (new format)
      const habitsData = Array.isArray(result) ? result : result.habits;
      const logsData = Array.isArray(result) ? [] : result.logs;
      
      // Calculate stats for each habit
      const habitsWithStats: HabitWithStats[] = habitsData.map(habit => {
        const typedHabit = {
          ...habit,
          frequency_type: habit.frequency_type as 'daily' | 'weekly' | 'specific_days'
        };
        const habitLogs = logsData.filter(log => log.habit_id === habit.id);
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
  
  const handleCreateHabit = async (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'active'>) => {
    if (!isAuthenticated || !user) return null;
    
    try {
      const result = await createHabitService(habit, user.id);
      if (result) {
        // Refresh habits to include the new one
        await fetchHabits();
      }
      return result;
    } catch (err) {
      console.error('Error creating habit:', err);
      setError(err instanceof Error ? err : new Error('Failed to create habit'));
      return null;
    }
  };
  
  const handleUpdateHabit = async (id: string, updates: Partial<Habit>) => {
    if (!isAuthenticated || !user) return null;
    
    try {
      const result = await updateHabitService(id, updates, user.id);
      if (result) {
        // Refresh habits to include updates
        await fetchHabits();
      }
      return result;
    } catch (err) {
      console.error('Error updating habit:', err);
      setError(err instanceof Error ? err : new Error('Failed to update habit'));
      return null;
    }
  };
  
  const handleDeleteHabit = async (id: string) => {
    if (!isAuthenticated || !user) return false;
    
    try {
      const result = await deleteHabitService(id, user.id);
      if (result) {
        // Refresh habits to remove the deleted one
        await fetchHabits();
      }
      return result;
    } catch (err) {
      console.error('Error deleting habit:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete habit'));
      return false;
    }
  };
  
  const handleToggleHabitCompletion = async (habitId: string, date: Date = new Date(), completed?: boolean) => {
    if (!isAuthenticated || !user) return false;
    
    try {
      const result = await toggleHabitCompletionService(habitId, user.id, date, completed);
      if (result) {
        // Refresh habits to update stats
        await fetchHabits();
      }
      return result;
    } catch (err) {
      console.error('Error toggling habit completion:', err);
      setError(err instanceof Error ? err : new Error('Failed to toggle habit completion'));
      return false;
    }
  };

  // Effect to load habits when user auth state changes
  useEffect(() => {
    fetchHabits();
  }, [isAuthenticated, user?.id]);

  return {
    habits,
    isLoading,
    error,
    createHabit: handleCreateHabit,
    updateHabit: handleUpdateHabit,
    deleteHabit: handleDeleteHabit,
    toggleHabitCompletion: handleToggleHabitCompletion,
    refreshHabits: fetchHabits
  };
};
