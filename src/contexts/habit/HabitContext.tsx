
import React, { createContext, useContext } from 'react';
import { Habit, HabitWithStats } from './habitTypes';
import { useHabitProvider } from './useHabitProvider';

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
  const habitProviderValue = useHabitProvider();

  return (
    <HabitContext.Provider value={habitProviderValue}>
      {children}
    </HabitContext.Provider>
  );
};
