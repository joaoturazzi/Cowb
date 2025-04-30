
// Motivational messages for Pomodoro completion
export const pomodoroMessages = [
  { title: "Pomodoro concluído!", description: "Parabéns pelo seu foco! 🎯" },
  { title: "Tempo de foco finalizado!", description: "Você está progredindo muito bem! 💪" },
  { title: "Ótimo trabalho!", description: "Continue construindo seu ritmo! 🚀" },
  { title: "Pomodoro concluído!", description: "Mais um passo em direção aos seus objetivos! ✨" },
  { title: "Tempo esgotado!", description: "Seu cérebro agradece pelo esforço concentrado! 🧠" },
];

// Break completion messages
export const breakCompletionMessages = [
  { title: "Pausa concluída!", description: "Vamos voltar ao trabalho. ⏱️" },
  { title: "Hora de focar novamente!", description: "Você está recarregado! 🔄" },
  { title: "Fim da pausa!", description: "De volta ao ritmo produtivo! 🏃" },
];

// Long break completion messages
export const longBreakMessages = [
  { title: "Pausa longa concluída!", description: "Vamos voltar ao trabalho com energia renovada! 🌱" },
  { title: "Recarga completa!", description: "Seu cérebro está pronto para mais desafios! 🧠" },
  { title: "Energia restaurada!", description: "Hora de voltar com tudo! ⚡" },
];

// Helper to get random message from array
export const getRandomMessage = (messageArray: Array<{title: string, description: string}>) => {
  return messageArray[Math.floor(Math.random() * messageArray.length)];
};
