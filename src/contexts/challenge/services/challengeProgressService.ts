
import { Challenge } from '../challengeTypes';
import { supabase } from '@/integrations/supabase/client';

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
      // Fix: Extract points correctly based on the type of rewardDetails
      let points = 0;
      
      if (typeof challenge.rewardDetails === 'string') {
        // If rewardDetails is a string, parse it as a number
        points = parseInt(challenge.rewardDetails);
      } else if (typeof challenge.rewardDetails === 'object' && challenge.rewardDetails !== null) {
        // If rewardDetails is an object, try to get the points property
        points = (challenge.rewardDetails as Record<string, any>).points || 0;
      }
        
      if (points > 0) {
        // Update the profile table directly without using rpc
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
