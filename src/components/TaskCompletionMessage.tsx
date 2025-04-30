
import React, { useState, useEffect } from 'react';

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

const emojis = ["🚀", "👏", "💪", "✨", "🌟", "🎯", "🎊", "🌈", "🌱", "🏆"];

const TaskCompletionMessage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('');

  useEffect(() => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    setMessage(randomMessage);
    setEmoji(randomEmoji);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 -mt-10 flex justify-center items-center">
      <div className="bg-white px-4 py-2 rounded-full shadow-md animate-celebrate">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <span className="font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionMessage;
