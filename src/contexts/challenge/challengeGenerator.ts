
import { Challenge, ChallengeType } from './challengeTypes';

// Generate a unique ID for challenges
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Collection of challenge templates
const challengeTemplates: Record<ChallengeType, { title: string; description: string; goal: number }[]> = {
  daily: [
    {
      title: "Complete 3 tarefas de alta prioridade",
      description: "Conclua 3 tarefas marcadas como alta prioridade hoje",
      goal: 3
    },
    {
      title: "Terminar tarefas antes do tempo estimado",
      description: "Complete 2 tarefas mais rápido que o tempo estimado",
      goal: 2
    },
    {
      title: "Foco total",
      description: "Complete 4 períodos de Pomodoro sem interrupções",
      goal: 4
    },
    {
      title: "Lista limpa",
      description: "Complete todas as tarefas programadas para hoje",
      goal: 1
    }
  ],
  weekly: [
    {
      title: "Mestre da produtividade",
      description: "Complete 15 tarefas em uma semana",
      goal: 15
    },
    {
      title: "Consistência é a chave",
      description: "Mantenha um streak de 5 dias completando pelo menos uma tarefa",
      goal: 5
    },
    {
      title: "Diversifique suas atividades",
      description: "Complete tarefas em 3 categorias diferentes",
      goal: 3
    },
    {
      title: "Planejamento de elite",
      description: "Adicione 10 tarefas com datas e prioridades definidas",
      goal: 10
    }
  ],
  surprise: [
    {
      title: "Hora de focar!",
      description: "Complete 3 tarefas nas próximas 2 horas",
      goal: 3
    },
    {
      title: "Desafio relâmpago",
      description: "Complete uma tarefa de alta prioridade nos próximos 30 minutos",
      goal: 1
    },
    {
      title: "Maratona de produtividade",
      description: "Complete 5 tarefas em sequência sem grandes pausas",
      goal: 5
    },
    {
      title: "Superação pessoal",
      description: "Complete uma tarefa que está na sua lista há mais de uma semana",
      goal: 1
    }
  ]
};

// Function to generate a random challenge based on type
export const generateChallenge = (type: ChallengeType): Challenge => {
  const templates = challengeTemplates[type];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  // Calculate expiration
  const expiresAt = new Date();
  if (type === 'daily') {
    expiresAt.setDate(expiresAt.getDate() + 1);
  } else if (type === 'weekly') {
    expiresAt.setDate(expiresAt.getDate() + 7);
  } else if (type === 'surprise') {
    // Surprise challenges expire in 24 hours
    expiresAt.setHours(expiresAt.getHours() + 24);
  }
  
  return {
    id: generateId(),
    title: randomTemplate.title,
    description: randomTemplate.description,
    type,
    goal: randomTemplate.goal,
    progress: 0,
    status: 'in-progress',
    expiresAt,
    createdAt: new Date(),
    reward: 'points'
  };
};
