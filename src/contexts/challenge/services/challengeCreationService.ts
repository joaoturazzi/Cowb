
import { supabase } from '@/integrations/supabase/client';

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
