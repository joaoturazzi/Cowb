
import { supabase } from '@/integrations/supabase/client';
import { getProfile, updateProfilePoints } from '@/contexts/userProfileService';
import { toast } from 'sonner';
import { Challenge, ChallengeParticipant } from '../challengeTypes';

/**
 * Join a challenge as a participant
 * @param challengeId The ID of the challenge to join
 * @param userId The user ID joining the challenge
 */
export const joinChallenge = async (challengeId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('challenge_participants')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
        progress: 0,
        status: 'active'
      });

    if (error) {
      console.error('Error joining challenge:', error);
      toast.error('Erro ao entrar no desafio');
      return false;
    }

    toast.success('Você entrou no desafio!');
    return true;
  } catch (error) {
    console.error('Exception joining challenge:', error);
    toast.error('Erro ao entrar no desafio');
    return false;
  }
};

/**
 * Update the progress of a user in a challenge
 * @param challengeId The challenge ID
 * @param userId The user ID
 * @param progress The new progress value
 */
export const updateChallengeProgress = async (
  challengeId: string,
  userId: string,
  progress: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('challenge_participants')
      .update({ progress, updated_at: new Date().toISOString() })
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating challenge progress:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Exception updating challenge progress:', error);
    return false;
  }
};

/**
 * Complete a challenge and award points to the user
 * @param challengeId The challenge ID
 * @param userId The user ID
 * @param challenge Full challenge object to extract reward details
 */
export const completeChallenge = async (
  challengeId: string,
  userId: string,
  challenge: Challenge
): Promise<boolean> => {
  try {
    // Determine points to award
    let pointsToAward = 100; // Default points
    
    // Extract points from reward_details if available
    if (challenge.reward_details && typeof challenge.reward_details === 'object') {
      const rewardDetails = challenge.reward_details as { points?: number };
      if (rewardDetails.points && typeof rewardDetails.points === 'number') {
        pointsToAward = rewardDetails.points;
      }
    }
    
    // Update participant status to completed
    const { error } = await supabase
      .from('challenge_participants')
      .update({ 
        status: 'completed', 
        progress: challenge.goal,
        updated_at: new Date().toISOString() 
      })
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error completing challenge:', error);
      return false;
    }
    
    // Award points to the user
    const userProfile = await getProfile(userId);
    if (userProfile) {
      const result = await updateProfilePoints(userId, userProfile.total_points + pointsToAward);
      if (!result) {
        console.error('Failed to update user points');
      }
    }

    toast.success(`Desafio concluído! Você ganhou ${pointsToAward} pontos.`);
    return true;
  } catch (error) {
    console.error('Exception completing challenge:', error);
    toast.error('Erro ao completar o desafio');
    return false;
  }
};

/**
 * Get all participants for a specific challenge
 * @param challengeId The challenge ID
 */
export const getParticipants = async (challengeId: string): Promise<ChallengeParticipant[]> => {
  try {
    const { data, error } = await supabase
      .from('challenge_participants')
      .select('*, profiles(username, avatar_url, display_name, level)')
      .eq('challenge_id', challengeId);

    if (error) {
      console.error('Error fetching participants:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching participants:', error);
    return [];
  }
};

/**
 * Leave a challenge (delete participation)
 * @param challengeId The challenge ID
 * @param userId The user ID
 */
export const leaveChallenge = async (challengeId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('challenge_participants')
      .delete()
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error leaving challenge:', error);
      toast.error('Erro ao sair do desafio');
      return false;
    }

    toast.success('Você saiu do desafio');
    return true;
  } catch (error) {
    console.error('Exception leaving challenge:', error);
    toast.error('Erro ao sair do desafio');
    return false;
  }
};
