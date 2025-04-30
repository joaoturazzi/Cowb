
import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { useTask } from '@/contexts';
import { Task } from '@/contexts/task/taskTypes';
import { DayTasks } from './types';

export const useUpcomingTasks = () => {
  const { tasks } = useTask();
  const [upcomingDays, setUpcomingDays] = useState<DayTasks[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [showCompletionMessage, setShowCompletionMessage] = useState<string | null>(null);
  const [completedTaskName, setCompletedTaskName] = useState<string>('');
  const [taskStreak, setTaskStreak] = useState<number>(0);
  
  // Prepare the 5-day task view
  useEffect(() => {
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
    
    // Sort tasks into the appropriate days
    tasks.forEach(task => {
      if (task.target_date) {
        const dayIndex = days.findIndex(day => 
          day.formattedDate === task.target_date
        );
        
        if (dayIndex !== -1) {
          days[dayIndex].tasks.push(task);
          days[dayIndex].isEmpty = false;
        }
      }
    });
    
    // Sort tasks by priority for each day
    days.forEach(day => {
      day.tasks.sort((a, b) => {
        // First, sort by completion status
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        
        // Then sort by priority
        const priorityValue = { high: 3, medium: 2, low: 1 };
        return priorityValue[b.priority as keyof typeof priorityValue] - 
               priorityValue[a.priority as keyof typeof priorityValue];
      });
    });
    
    setUpcomingDays(days);
  }, [tasks]);

  const showTaskCompletionMessage = (taskId: string, taskName: string) => {
    setCompletedTaskName(taskName);
    setShowCompletionMessage(taskId);
    
    setTimeout(() => {
      setShowCompletionMessage(null);
    }, 3000);
  };

  const updateTaskStreak = () => {
    setTaskStreak(prev => prev + 1);
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
    updateTaskStreak,
    showTaskCompletionMessage
  };
};
