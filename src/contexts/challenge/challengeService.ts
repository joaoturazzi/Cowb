
import { Challenge, ChallengeReward, ChallengeStatus, ChallengeType } from './challengeTypes';
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
      rewardDetails: p.shared_challenges.reward_details,
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

export const updateChallengeProgressService = async (
  challengeId: string, 
  userId: string, 
  progress: number
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('challenge_participants')
      .update({ 
        progress, 
        updated_at: new Date().toISOString() 
      })
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error updating challenge progress:', error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error updating challenge progress:', error);
    return { success: false, error: error as Error };
  }
};

export const completeChallengeService = async (
  challengeId: string, 
  userId: string,
  challenge: Challenge
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('challenge_participants')
      .update({ 
        status: 'completed', 
        updated_at: new Date().toISOString() 
      })
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error completing challenge:', error);
      return { success: false, error };
    }
    
    // Update user points if there's a points reward
    if (challenge.reward === 'points' && challenge.rewardDetails) {
      const points = typeof challenge.rewardDetails === 'string' 
        ? parseInt(challenge.rewardDetails)
        : challenge.rewardDetails?.points || 0;
        
      if (points > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            total_points: supabase.rpc('increment', { x: points }),
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (profileError) {
          console.error('Error updating user points:', profileError);
          // We don't fail the operation if just the points update fails
        }
      }
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error completing challenge:', error);
    return { success: false, error: error as Error };
  }
};

export const createSurpriseChallengeService = async (
  userId: string,
  template: {
    title: string;
    description: string;
    type: string;
    goal: number;
    durationDays?: number;
    rewardPoints?: number;
  }
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + (template.durationDays || 1));
    
    // Insert the new challenge
    const { data: challenge, error } = await supabase
      .from('shared_challenges')
      .insert({
        title: template.title,
        description: template.description,
        type: template.type,
        goal: template.goal,
        creator_id: userId,
        end_date: expiration.toISOString(),
        reward_type: 'points',
        reward_details: { points: template.rewardPoints || 50 }
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating surprise challenge:', error);
      return { success: false, error };
    }
    
    // Add the user as a participant
    const { error: participantError } = await supabase
      .from('challenge_participants')
      .insert({
        challenge_id: challenge.id,
        user_id: userId,
        status: 'in-progress',
        progress: 0
      });
      
    if (participantError) {
      console.error('Error adding user as challenge participant:', participantError);
      return { success: false, error: participantError };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error generating surprise challenge:', error);
    return { success: false, error: error as Error };
  }
};

// Helper function to transform database challenge to Challenge type
const transformChallenge = (c: any): Challenge => ({
  id: c.id,
  title: c.title,
  description: c.description || '',
  type: c.type as ChallengeType,
  goal: c.goal,
  progress: 0, // Default progress
  status: c.status as ChallengeStatus,
  reward: c.reward_type as ChallengeReward | undefined,
  rewardDetails: c.reward_details,
  expiresAt: c.end_date,
  createdAt: c.created_at
});
