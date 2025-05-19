
import React from 'react';
import { Flame, Star, Trophy, Sparkles } from 'lucide-react';

interface HabitCompletionMessageProps {
  habitName: string;
  streak: number;
}

const messages = [
  {
    threshold: 0,
    messages: [
      "Ótimo trabalho! 👏",
      "Parabéns pelo progresso! ✅",
      "Continue assim! 💪",
      "Você está criando um novo hábito! 🌱",
      "O primeiro passo para uma nova rotina! 🚶"
    ]
  },
  {
    threshold: 3,
    messages: [
      "Sequência de 3 dias! ⚡",
      "Você está pegando o ritmo! 🔥",
      "Três dias seguidos! 🎯",
      "Construindo consistência! 📈",
      "Você está em uma sequência! ⭐"
    ]
  },
  {
    threshold: 7,
    messages: [
      "7 dias consecutivos! 🔥🔥",
      "Uma semana completa! 🎊",
      "Sequência impressionante! 🚀",
      "Você está construindo um hábito sólido! 💯",
      "Sete dias de sucesso! 🏆"
    ]
  },
  {
    threshold: 14,
    messages: [
      "Duas semanas completas! 🔥🔥🔥",
      "14 dias de compromisso! 💪💪",
      "Você está dominando este hábito! ⭐⭐",
      "Impressionante consistência! 🌟",
      "Continue nesse ritmo incrível! 🚀🚀"
    ]
  },
  {
    threshold: 30,
    messages: [
      "30 dias! Hábito formado! 🏆🏆",
      "Um mês completo! Extraordinário! 🌟🌟🌟",
      "Você alcançou a maestria! 👑",
      "Isso já faz parte da sua rotina! 💎",
      "Dedicação inspiradora! 🔥🔥🔥🔥"
    ]
  },
  {
    threshold: 100,
    messages: [
      "100 dias! Você é uma lenda! 👑👑👑",
      "Disciplina de outro nível! 💯💯",
      "Uma conquista incrível! 🏆🏆🏆",
      "Você é inspiração para todos! 🌠",
      "Excelência absoluta! 💎💎💎"
    ]
  }
];

const HabitCompletionMessage: React.FC<HabitCompletionMessageProps> = ({ habitName, streak }) => {
  // Encontrar a mensagem apropriada com base no streak atual
  const getMessageGroup = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (streak >= messages[i].threshold) {
        return messages[i];
      }
    }
    return messages[0];
  };

  const messageGroup = getMessageGroup();
  const randomMessage = messageGroup.messages[Math.floor(Math.random() * messageGroup.messages.length)];

  // Escolher o ícone apropriado com base no streak
  const getIcon = () => {
    if (streak >= 100) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (streak >= 30) return <Trophy className="h-6 w-6 text-orange-500" />;
    if (streak >= 14) return <Flame className="h-6 w-6 text-orange-500" />;
    if (streak >= 7) return <Flame className="h-6 w-6 text-blue-500" />;
    if (streak >= 3) return <Star className="h-6 w-6 text-primary" />;
    return <Sparkles className="h-6 w-6 text-primary" />;
  };

  return (
    <div className="flex items-center gap-2 bg-primary/10 px-4 py-3 rounded-lg border border-primary/20 mb-4">
      {getIcon()}
      <div>
        <p className="font-medium">{habitName}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm">{randomMessage}</p>
          {streak > 1 && (
            <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
              {streak} dias
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitCompletionMessage;
