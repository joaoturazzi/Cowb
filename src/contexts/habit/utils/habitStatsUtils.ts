
import { Habit, HabitLog, HabitWithStats } from '../habitTypes';
import { formatDate } from '@/utils/dateUtils';

/**
 * Calculates statistics for a habit based on its logs
 * @param habit The habit to calculate stats for
 * @param logs The habit logs to use for calculation
 * @returns The habit with calculated statistics
 */
export const calculateHabitStats = (habit: Habit, logs: HabitLog[]): HabitWithStats => {
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
