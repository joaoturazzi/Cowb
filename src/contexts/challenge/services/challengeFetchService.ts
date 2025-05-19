
import { Challenge, ChallengeReward, ChallengeStatus, ChallengeType } from '../challengeTypes';
import { supabase } from '@/integrations/supabase/client';
import { sonnerToast as toast } from '@/components/ui';

export interface ChallengeServiceResponse {
  data: Challenge[] | null;
  error: Error | null;
}

export const fetchUserChallenges = async (userId: string): Promise<ChallengeServiceResponse> => {
  try {
    // Fetch challenges created by the user
    const { data: createdChallenges, error: createdError } = await supabase
      .from('shared_challenges')
      .select('*')
      .eq('creator_id', userId);
      
    // Fetch challenges where user is a participant
    const { data: participatingData, error: participatingError } = await supabase
      .from('challenge_participants')
      .select(`
        challenge_id,
        status,
        progress,
        shared_challenges (*)
      `)
      .eq('user_id', userId);
      
    if (createdError || participatingError) {
      console.error('Error fetching challenges:', createdError || participatingError);
      toast.error('Erro ao carregar desafios');
      return { data: null, error: createdError || participatingError };
    }
    
    // Transform and combine challenges
    const created = createdChallenges?.map(c => transformChallenge(c)) || [];
    
    const participating = participatingData?.map(p => ({
      id: p.shared_challenges.id,
      title: p.shared_challenges.title,
      description: p.shared_challenges.description || '',
      type: p.shared_challenges.type as ChallengeType,
      goal: p.shared_challenges.goal,
      progress: p.progress,
      status: p.status as ChallengeStatus,
      reward: p.shared_challenges.reward_type as ChallengeReward | undefined,
      rewardDetails: p.shared_challenges.reward_details as Record<string, any> | string | undefined,
      expiresAt: p.shared_challenges.end_date,
      createdAt: p.shared_challenges.created_at
    })) || [];
    
    // Combine and deduplicate
    const allChallenges = [...created];
    participating.forEach(p => {
      if (!allChallenges.some(c => c.id === p.id)) {
        allChallenges.push(p);
      }
    });
    
    return { data: allChallenges, error: null };
  } catch (error) {
    console.error('Unexpected error fetching challenges:', error);
    return { data: null, error: error as Error };
  }
};

// Helper function to transform database challenge to Challenge type
export const transformChallenge = (c: any): Challenge => ({
  id: c.id,
  title: c.title,
  description: c.description || '',
  type: c.type as ChallengeType,
  goal: c.goal,
  progress: 0, // Default progress
  status: c.status as ChallengeStatus,
  reward: c.reward_type as ChallengeReward | undefined,
  rewardDetails: c.reward_details as Record<string, any> | string | undefined,
  expiresAt: c.end_date,
  createdAt: c.created_at
});
