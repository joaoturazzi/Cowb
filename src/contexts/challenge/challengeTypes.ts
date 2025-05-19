
export type ChallengeType = 'daily' | 'weekly' | 'surprise' | 'team' | 'competition';
export type ChallengeStatus = 'locked' | 'in-progress' | 'completed' | 'invited' | 'active' | 'declined' | 'canceled';
export type ChallengeReward = 'points' | 'badge' | 'theme' | 'wager';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  goal: number;
  progress: number;
  status: ChallengeStatus;
  reward?: ChallengeReward;
  rewardDetails?: string | Record<string, any>;
  expiresAt?: string | Date;
  createdAt: string | Date;
}

export interface ChallengeContextType {
  challenges: Challenge[];
  activeChallenge: Challenge | null;
  dailyChallenges: Challenge[];
  weeklyChallenges: Challenge[];
  surpriseChallenges: Challenge[];
  completedChallenges: number;
  updateChallengeProgress: (challengeId: string, progress: number) => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
  generateSurpriseChallenge: () => Promise<void>;
}

export interface UserProgress {
  totalTasksCompleted: number;
  highPriorityTasksCompleted: number;
  streakDays: number;
  points: number;
  level: number;
}
