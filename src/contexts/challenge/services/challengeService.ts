
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Challenge } from '../challengeTypes';

/**
 * Fetch all challenges
 * @param userId Current user ID for filtering challenges
 */
export const fetchChallenges = async (userId: string): Promise<Challenge[]> => {
  try {
    // Fetch challenges where the user is the creator or a participant
    const { data, error } = await supabase
      .from('shared_challenges')
      .select(`
        *,
        challenge_participants!inner (
          id,
          user_id,
          progress,
          status
        )
      `)
      .or(`creator_id.eq.${userId},challenge_participants.user_id.eq.${userId}`);

    if (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching challenges:', error);
    return [];
  }
};

/**
 * Generate a new challenge
 * @param challenge The challenge object to create
 */
export const generateChallenge = async (challenge: Partial<Challenge>): Promise<Challenge | null> => {
  try {
    const { data, error } = await supabase
      .from('shared_challenges')
      .insert({
        title: challenge.title,
        description: challenge.description,
        creator_id: challenge.creator_id,
        type: challenge.type || 'personal',
        goal: challenge.goal || 1, 
        reward_type: challenge.reward_type || 'points',
        reward_details: challenge.reward_details || { points: 100 },
        start_date: challenge.start_date || new Date().toISOString(),
        end_date: challenge.end_date,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating challenge:', error);
      toast.error('Erro ao criar desafio');
      return null;
    }

    toast.success('Desafio criado com sucesso!');
    return data;
  } catch (error) {
    console.error('Exception creating challenge:', error);
    toast.error('Erro ao criar desafio');
    return null;
  }
};

/**
 * Update an existing challenge
 * @param challengeId The ID of the challenge to update
 * @param updates The fields to update
 */
export const updateChallenge = async (
  challengeId: string, 
  updates: Partial<Challenge>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shared_challenges')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', challengeId);

    if (error) {
      console.error('Error updating challenge:', error);
      toast.error('Erro ao atualizar desafio');
      return false;
    }

    toast.success('Desafio atualizado com sucesso!');
    return true;
  } catch (error) {
    console.error('Exception updating challenge:', error);
    toast.error('Erro ao atualizar desafio');
    return false;
  }
};

/**
 * Delete a challenge
 * @param challengeId The ID of the challenge to delete
 * @param userId User ID to verify creator permission
 */
export const deleteChallenge = async (challengeId: string, userId: string): Promise<boolean> => {
  try {
    // First verify the user is the creator of this challenge
    const { data: challengeData, error: fetchError } = await supabase
      .from('shared_challenges')
      .select('creator_id')
      .eq('id', challengeId)
      .single();

    if (fetchError) {
      console.error('Error fetching challenge for deletion:', fetchError);
      toast.error('Erro ao verificar permissões');
      return false;
    }

    // Check if user is the creator
    if (challengeData && challengeData.creator_id !== userId) {
      toast.error('Você não tem permissão para excluir este desafio');
      return false;
    }

    // Delete all challenge participants first (cascade doesn't work reliably)
    const { error: participantsError } = await supabase
      .from('challenge_participants')
      .delete()
      .eq('challenge_id', challengeId);

    if (participantsError) {
      console.error('Error deleting challenge participants:', participantsError);
      toast.error('Erro ao excluir participantes do desafio');
      return false;
    }

    // Now delete the challenge itself
    const { error } = await supabase
      .from('shared_challenges')
      .delete()
      .eq('id', challengeId);

    if (error) {
      console.error('Error deleting challenge:', error);
      toast.error('Erro ao excluir desafio');
      return false;
    }

    toast.success('Desafio excluído com sucesso!');
    return true;
  } catch (error) {
    console.error('Exception deleting challenge:', error);
    toast.error('Erro ao excluir desafio');
    return false;
  }
};
