
import { ChallengeType } from './challengeTypes';

interface ChallengeTemplate {
  title: string;
  description: string;
  type: ChallengeType;
  goal: number;
  rewardPoints?: number;
  durationDays?: number; // How many days the challenge lasts
}

// Daily challenge templates
const dailyChallengeTemplates: ChallengeTemplate[] = [
  {
    title: "Super Produtivo",
    description: "Complete 5 tarefas hoje",
    type: "daily",
    goal: 5,
    rewardPoints: 50,
    durationDays: 1
  },
  {
    title: "Prioridades em Dia",
    description: "Complete 3 tarefas de alta prioridade",
    type: "daily",
    goal: 3,
    rewardPoints: 60,
    durationDays: 1
  },
  {
    title: "Foco Total",
    description: "Complete 4 sessões pomodoro sem interrupções",
    type: "daily",
    goal: 4,
    rewardPoints: 40,
    durationDays: 1
  }
];

// Weekly challenge templates
const weeklyChallengeTemplates: ChallengeTemplate[] = [
  {
    title: "Semana Produtiva",
    description: "Complete 20 tarefas esta semana",
    type: "weekly",
    goal: 20,
    rewardPoints: 150,
    durationDays: 7
  },
  {
    title: "Hábitos Consistentes",
    description: "Mantenha 3 hábitos por 5 dias seguidos",
    type: "weekly",
    goal: 15,
    rewardPoints: 200,
    durationDays: 7
  },
  {
    title: "Mestre do Tempo",
    description: "Acumule 10 horas de foco esta semana",
    type: "weekly",
    goal: 600,
    rewardPoints: 250,
    durationDays: 7
  }
];

// Surprise challenge templates
const surpriseChallengeTemplates: ChallengeTemplate[] = [
  {
    title: "Desafio Relâmpago",
    description: "Complete 3 tarefas nas próximas 3 horas",
    type: "surprise",
    goal: 3,
    rewardPoints: 75,
    durationDays: 0.125 // 3 hours
  },
  {
    title: "Maratona de Foco",
    description: "Complete 5 sessões pomodoro hoje",
    type: "surprise",
    goal: 5,
    rewardPoints: 100,
    durationDays: 1
  },
  {
    title: "Superação de Limites",
    description: "Complete todas as tarefas atrasadas",
    type: "surprise",
    goal: 1,
    rewardPoints: 150,
    durationDays: 2
  }
];

// Generate a random challenge based on type
export function generateChallenge(type: ChallengeType): ChallengeTemplate {
  let templates: ChallengeTemplate[];
  
  switch (type) {
    case 'daily':
      templates = dailyChallengeTemplates;
      break;
    case 'weekly':
      templates = weeklyChallengeTemplates;
      break;
    case 'surprise':
      templates = surpriseChallengeTemplates;
      break;
    default:
      templates = dailyChallengeTemplates;
  }
  
  // Pick a random template
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

// Calculate expiration date based on challenge duration
export function calculateExpirationDate(durationDays: number): Date {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + durationDays);
  return expiration;
}
