import { useState, useEffect } from 'react';
import { useTask } from '@/contexts';
import { Task } from '@/contexts/task/taskTypes';
import { DayTasks } from './types';
import { format, addDays } from '@/utils/dateUtils';

export const useUpcomingTasks = () => {
  // Use defensive coding to handle potential null/undefined values
  const taskContext = useTask();
  const tasks = taskContext?.tasks || [];
  
  const [upcomingDays, setUpcomingDays] = useState<DayTasks[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [showCompletionMessage, setShowCompletionMessage] = useState<string | null>(null);
  const [completedTaskName, setCompletedTaskName] = useState<string>('');
  const [taskStreak, setTaskStreak] = useState<number>(0);
  const [lastCompletionTime, setLastCompletionTime] = useState<number | null>(null);
  
  // Prepare the 5-day task view
  useEffect(() => {
    try {
      const days: DayTasks[] = [];
      const today = new Date();
      
      // Create an array for today + next 4 days
      for (let i = 0; i < 5; i++) {
        const currentDate = addDays(today, i);
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        
        days.push({
          date: currentDate,
          formattedDate,
          tasks: [],
          isEmpty: true
        });
      }
      
      // Check if tasks array is valid before processing
      if (Array.isArray(tasks)) {
        // Sort tasks into the appropriate days
        tasks.forEach(task => {
          if (task && task.target_date) {
            const dayIndex = days.findIndex(day => 
              day.formattedDate === task.target_date
            );
            
            if (dayIndex !== -1) {
              days[dayIndex].tasks.push(task);
              days[dayIndex].isEmpty = false;
            }
          }
        });
        
        // Sort tasks by priority and completion status for each day
        days.forEach(day => {
          day.tasks.sort((a, b) => {
            // First, sort by completion status
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            
            // Then sort by priority
            const priorityValue = { high: 3, medium: 2, low: 1 };
            const priorityA = a.priority ? (a.priority as keyof typeof priorityValue) : 'low';
            const priorityB = b.priority ? (b.priority as keyof typeof priorityValue) : 'low';
            
            return (priorityValue[priorityB] || 1) - (priorityValue[priorityA] || 1);
          });
        });
      }
      
      setUpcomingDays(days);
      
      // Auto-select today's tab if available
      const todayFormatted = format(today, 'yyyy-MM-dd');
      const todayExists = days.some(day => day.formattedDate === todayFormatted);
      
      if (todayExists && selectedDay !== todayFormatted) {
        setSelectedDay(todayFormatted);
      }
    } catch (error) {
      console.error("Error preparing upcoming days:", error);
      // Set default empty array if there's an error
      setUpcomingDays([]);
    }
  }, [tasks, selectedDay]);

  // Track task streak with proper timing
  useEffect(() => {
    if (lastCompletionTime && showCompletionMessage) {
      const now = Date.now();
      const timeDiff = now - lastCompletionTime;
      
      // If completed within 5 minutes, increase streak
      if (timeDiff <= 5 * 60 * 1000) {
        setTaskStreak(prev => prev + 1);
      } else {
        // Otherwise reset streak
        setTaskStreak(1);
      }
    }
  }, [showCompletionMessage, lastCompletionTime]);

  const showTaskCompletionMessage = (taskId: string, taskName: string) => {
    try {
      // Record completion time for streak tracking
      setLastCompletionTime(Date.now());
      setCompletedTaskName(taskName || '');
      setShowCompletionMessage(taskId);
      
      setTimeout(() => {
        setShowCompletionMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error showing task completion message:", error);
    }
  };

  return {
    upcomingDays,
    selectedDay,
    setSelectedDay,
    showCompletionMessage,
    setShowCompletionMessage,
    completedTaskName,
    setCompletedTaskName,
    taskStreak,
    lastCompletionTime,
    showTaskCompletionMessage
  };
};
