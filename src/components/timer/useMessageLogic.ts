
import { Task } from '@/contexts';
import { getRandomMessage, pomodoroMessages, breakCompletionMessages, longBreakMessages } from './timerMessages';

export const useMessageLogic = (completedPomodoros: number) => {
  // Get contextual message based on current task
  const getContextualMessage = (currentTask: Task | null) => {
    if (!currentTask) return null;
    
    // If this is a 3+ pomodoro sequence, add extra encouragement
    if (completedPomodoros >= 2) {
      return {
        title: `${completedPomodoros + 1}º Pomodoro consecutivo!`,
        description: "Sua consistência é impressionante! 🔥"
      };
    }
    
    // Task specific messages based on name
    const taskName = currentTask.name.toLowerCase();
    if (taskName.includes('relat')) {
      return { 
        title: "Pomodoro concluído!",
        description: "Seu relatório está ficando excelente! 📊" 
      };
    } else if (taskName.includes('estud')) {
      return { 
        title: "Sessão de estudo concluída!",
        description: "Seu conhecimento está crescendo! 📚" 
      };
    } else if (taskName.includes('cod') || taskName.includes('program')) {
      return { 
        title: "Sessão de coding finalizada!",
        description: "Seu código está evoluindo! 💻" 
      };
    }
    
    return null;
  };
  
  return {
    getContextualMessage,
    getRandomMessage,
    pomodoroMessages,
    breakCompletionMessages,
    longBreakMessages
  };
};
