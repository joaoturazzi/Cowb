
export type ChallengeType = 'personal' | 'team' | 'public';
export type ChallengeStatus = 'active' | 'completed' | 'expired';
export type ParticipantStatus = 'invited' | 'active' | 'completed' | 'declined';
export type RewardType = 'points' | 'badge' | 'custom';

export interface RewardDetails {
  points?: number;
  badgeId?: string;
  customMessage?: string;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  progress: number;
  status: ParticipantStatus;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    avatar_url?: string;
    display_name?: string;
    level?: number;
  };
}

export interface Challenge {
  id: string;
  creator_id: string;
  team_id?: string;
  title: string;
  description?: string;
  type: ChallengeType;
  goal: number;
  reward_type?: RewardType;
  reward_details?: RewardDetails;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  status: ChallengeStatus;
  wager?: string;
  challenge_participants?: ChallengeParticipant[];
}
