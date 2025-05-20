
import { useState, useEffect, useCallback } from 'react';
import { useTasks, useAuth, useTimer } from '@/contexts';
import { Task } from '@/contexts/task/taskTypes';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useTaskList = () => {
  const taskContext = useTasks();
  
  // Safely access properties that might not exist in the taskContext
  const tasks = taskContext?.tasks || [];
  const toggleTaskCompletion = taskContext?.completeTask || (() => {});
  const currentTask = taskContext?.currentTask || null;
  const setCurrentTask = taskContext?.setCurrentTask || (() => {});
  const removeTask = taskContext?.deleteTask || (() => {});
  
  const { isAuthenticated } = useAuth();
  const { timerState } = useTimer();
  const [showCompletionMessage, setShowCompletionMessage] = useState<string | null>(null);
  const [completedTaskName, setCompletedTaskName] = useState<string>('');
  const [taskStreak, setTaskStreak] = useState<number>(0);
  const [lastCompletionTime, setLastCompletionTime] = useState<number | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Add initial loading state
  useEffect(() => {
    // Add a small delay to ensure contexts are properly initialized
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Memoize the sortedTasks to prevent unnecessary re-sorts
  const sortedTasks = useCallback(() => {
    return [...tasks].sort((a, b) => {
      // Always put completed tasks at the bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      // If both are incomplete, sort by priority first
      if (!a.completed && !b.completed) {
        // Sort by priority (high > medium > low)
        const priorityValue = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityValue[b.priority as keyof typeof priorityValue] - 
                           priorityValue[a.priority as keyof typeof priorityValue];
        
        if (priorityDiff !== 0) return priorityDiff;
        
        // If same priority, sort by estimated time
        return a.estimatedTime - b.estimatedTime;
      }
      
      // If both are completed, sort by most recently completed
      return 0;
    });
  }, [tasks]);
  
  // Calculate metrics only when tasks change
  const metrics = useCallback(() => {
    const total = tasks.reduce((total, task) => total + task.estimatedTime, 0);
    const completed = tasks
      .filter(task => task.completed)
      .reduce((total, task) => total + task.estimatedTime, 0);
    const remaining = tasks
      .filter(task => !task.completed)
      .reduce((total, task) => total + task.estimatedTime, 0);
      
    return { totalEstimatedTime: total, completedTime: completed, remainingTime: remaining };
  }, [tasks]);
  
  // Check for task streak (tasks completed within a 5-minute window)
  useEffect(() => {
    if (lastCompletionTime) {
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
  }, [showCompletionMessage]);
  
  const handleTaskSelect = useCallback((task: Task) => {
    setCurrentTask(task);
  }, [setCurrentTask]);
  
  const handleTaskCheck = useCallback((taskId: string) => {
    const taskToComplete = tasks.find(t => t.id === taskId);
    
    if (taskToComplete) {
      // Store task name for contextual message
      setCompletedTaskName(taskToComplete.name);
      
      // Record the completion time for streak tracking
      setLastCompletionTime(Date.now());
      
      // Toggle completion status
      toggleTaskCompletion(taskId);
      
      // Show completion message
      setShowCompletionMessage(taskId);
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setShowCompletionMessage(null);
      }, 3000);
    }
  }, [tasks, toggleTaskCompletion]);
  
  const handleDeleteTask = useCallback((taskId: string) => {
    removeTask(taskId);
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida com sucesso.",
    });
  }, [removeTask, toast]);
  
  const handleEditTask = useCallback((task: Task) => {
    setTaskToEdit(task);
  }, []);
  
  // Calculate metrics once
  const { totalEstimatedTime, completedTime, remainingTime } = metrics();
  
  return {
    isAuthenticated,
    timerState,
    currentTask,
    sortedTasks: sortedTasks(),
    totalEstimatedTime,
    completedTime,
    remainingTime,
    showCompletionMessage,
    completedTaskName,
    taskStreak,
    taskToEdit,
    navigate,
    setTaskToEdit,
    handleTaskSelect,
    handleTaskCheck,
    handleDeleteTask,
    handleEditTask,
    isLoading,
  };
};
