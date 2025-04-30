
import React, { useState, useEffect } from 'react';

interface TaskCompletionMessageProps {
  taskName?: string;
  streak?: number;
}

const messages = [
  "Boa! Menos uma. 🚀",
  "Progresso é progresso! 👏",
  "Continue assim! 💪",
  "Um passo de cada vez. ✨",
  "Você está indo muito bem! 🌟",
  "Tudo bem se não for perfeito. 🌈",
  "Você está fazendo o seu melhor! 🌱",
  "Celebrando cada vitória! 🎉",
  "Foco no processo, não na perfeição. 🧘",
  "Mais uma conquista! 🏆"
];

// Contextual messages based on task name
const getContextualMessage = (taskName: string): string => {
  if (!taskName) return '';
  
  if (taskName.toLowerCase().includes('relat')) {
    return "Organização é a chave do sucesso! 📊";
  } else if (taskName.toLowerCase().includes('email') || taskName.toLowerCase().includes('e-mail')) {
    return "Comunicação eficiente conquista resultados! 📧";
  } else if (taskName.toLowerCase().includes('estud')) {
    return "Cada página te leva mais longe! 📚";
  } else if (taskName.toLowerCase().includes('reuni')) {
    return "Colaboração gera transformação! 👥";
  } else if (taskName.toLowerCase().includes('planej')) {
    return "Planejar hoje é colher amanhã! 📋";
  } else if (taskName.toLowerCase().includes('escrev') || taskName.toLowerCase().includes('text')) {
    return "Suas palavras têm poder! ✍️";
  } else if (taskName.toLowerCase().includes('cod') || taskName.toLowerCase().includes('program')) {
    return "Cada linha de código te aproxima da solução! 💻";
  }
  
  // Default return a random message
  return '';
};

// Streak-based messages
const getStreakMessage = (streak: number): string => {
  if (streak >= 5) {
    return `Incrível! ${streak} tarefas consecutivas! 🔥`;
  } else if (streak >= 3) {
    return `Sequência de ${streak} tarefas! Está pegando o ritmo! ⚡`;
  } else if (streak === 2) {
    return "Duas seguidas! Continue assim! 🌊";
  }
  return '';
};

const emojis = ["🚀", "👏", "💪", "✨", "🌟", "🎯", "🎊", "🌈", "🌱", "🏆", "🔥", "⭐", "💯"];

const TaskCompletionMessage: React.FC<TaskCompletionMessageProps> = ({ taskName = '', streak = 0 }) => {
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('');
  
  useEffect(() => {
    // First try to get a contextual message based on task name
    let selectedMessage = getContextualMessage(taskName);
    
    // If no contextual message, try streak-based message
    if (!selectedMessage && streak > 1) {
      selectedMessage = getStreakMessage(streak);
    }
    
    // If still no message, use random general message
    if (!selectedMessage) {
      selectedMessage = messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Always get a random emoji
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    setMessage(selectedMessage);
    setEmoji(randomEmoji);
  }, [taskName, streak]);

  return (
    <div className="absolute top-0 left-0 right-0 -mt-10 flex justify-center items-center">
      <div className="completion-message animate-celebrate">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <span className="font-medium">{message}</span>
          {streak > 1 && (
            <span className="ml-1 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-sm">
              {streak}x
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionMessage;
