
export type ChallengeType = 'daily' | 'weekly' | 'surprise';
export type ChallengeStatus = 'locked' | 'in-progress' | 'completed';
export type ChallengeReward = 'points' | 'badge' | 'theme';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  goal: number;
  progress: number;
  status: ChallengeStatus;
  reward?: ChallengeReward;
  rewardDetails?: string;
  expiresAt?: Date;
  createdAt: Date;
}

export interface ChallengeContextType {
  challenges: Challenge[];
  activeChallenge: Challenge | null;
  dailyChallenges: Challenge[];
  weeklyChallenges: Challenge[];
  surpriseChallenges: Challenge[];
  completedChallenges: number;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  completeChallenge: (challengeId: string) => void;
  generateSurpriseChallenge: () => void;
}

export interface UserProgress {
  totalTasksCompleted: number;
  highPriorityTasksCompleted: number;
  streakDays: number;
  points: number;
  level: number;
}
